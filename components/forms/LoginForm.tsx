import { config } from '@/config/env';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from '../common/Button';
import { InputField } from './InputField';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [hasSavedCredentials, setHasSavedCredentials] = useState(false);
  const { login } = useAuth();
  const { effectiveTheme } = useTheme();
  const router = useRouter();
  const isDark = effectiveTheme === 'dark';

  useEffect(() => {
    checkBiometricAvailability();
    checkSavedCredentials();
  }, []);

  const checkBiometricAvailability = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      setBiometricAvailable(compatible && enrolled);
    } catch (error) {
      console.error('Error checking biometric availability:', error);
    }
  };

  const checkSavedCredentials = async () => {
    try {
      const savedCredentials = await AsyncStorage.getItem(config.BIOMETRIC_CREDENTIALS_KEY);
      setHasSavedCredentials(!!savedCredentials);
    } catch (error) {
      console.error('Error checking saved credentials:', error);
    }
  };

  const saveCredentialsForBiometric = async (email: string, password: string) => {
    try {
      await AsyncStorage.setItem(
        config.BIOMETRIC_CREDENTIALS_KEY,
        JSON.stringify({ email, password })
      );
    } catch (error) {
      console.error('Error saving credentials:', error);
    }
  };

  const handleBiometricLogin = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Autentícate para iniciar sesión',
        fallbackLabel: 'Usar contraseña',
        cancelLabel: 'Cancelar',
      });

      if (result.success) {
        const savedCredentials = await AsyncStorage.getItem(config.BIOMETRIC_CREDENTIALS_KEY);
        if (savedCredentials) {
          const { email, password } = JSON.parse(savedCredentials);
          setIsLoading(true);
          try {
            await login(email, password);
            Alert.alert(
              'Éxito',
              'Has iniciado sesión correctamente',
              [
                {
                  text: 'OK',
                  onPress: () => router.replace('/'),
                },
              ]
            );
          } catch (error) {
            AsyncStorage.removeItem(config.BIOMETRIC_CREDENTIALS_KEY)
            Alert.alert(
              'Error',
              error instanceof Error ? error.message : 'Error al iniciar sesión'
            );
          } finally {
            setIsLoading(false);
          }
        }
      }
    } catch (error) {
      console.error('Biometric authentication error:', error);
      Alert.alert('Error', 'No se pudo autenticar con biometría');
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email inválido';
    }

    if (!password) {
      newErrors.password = 'La contraseña es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);

      if (biometricAvailable && !hasSavedCredentials) {
        Alert.alert(
          '¿Habilitar inicio con huella?',
          'Podrás iniciar sesión rápidamente usando tu huella digital',
          [
            {
              text: 'No',
              style: 'cancel',
            },
            {
              text: 'Sí, habilitar',
              onPress: async () => {
                await saveCredentialsForBiometric(email, password);
                setHasSavedCredentials(true);
              },
            },
          ]
        );
      }

      Alert.alert(
        'Éxito',
        'Has iniciado sesión correctamente',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/'),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Error al iniciar sesión'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {biometricAvailable && hasSavedCredentials && (
        <TouchableOpacity
          style={[styles.biometricButton, isDark && styles.biometricButtonDark]}
          onPress={handleBiometricLogin}
          disabled={isLoading}
        >
          <MaterialIcons
            name="fingerprint"
            size={32}
            color={isDark ? '#e5e5e5' : '#1a1a1a'}
          />
          <Text style={[styles.biometricText, isDark && styles.biometricTextDark]}>
            Iniciar con huella
          </Text>
        </TouchableOpacity>
      )}

      {biometricAvailable && hasSavedCredentials && (
        <View style={styles.divider}>
          <View style={[styles.dividerLine, isDark && styles.dividerLineDark]} />
          <Text style={[styles.dividerText, isDark && styles.dividerTextDark]}>o continúa con</Text>
          <View style={[styles.dividerLine, isDark && styles.dividerLineDark]} />
        </View>
      )}

      <InputField
        label="Email"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          if (errors.email) setErrors({ ...errors, email: undefined });
        }}
        keyboardType="email-address"
        autoCapitalize="none"
        error={errors.email}
      />
      <InputField
        label="Contraseña"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          if (errors.password) setErrors({ ...errors, password: undefined });
        }}
        secureTextEntry
        autoCapitalize="none"
        error={errors.password}
      />
      <Button
        title="Iniciar Sesión"
        onPress={handleLogin}
        loading={isLoading}
        style={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  button: {
    marginTop: 8,
  },
  biometricButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 24,
    gap: 12,
  },
  biometricButtonDark: {
    backgroundColor: '#2a2a2a',
    borderColor: '#3a3a3a',
  },
  biometricText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#1a1a1a',
    letterSpacing: 0.3,
  },
  biometricTextDark: {
    color: '#e5e5e5',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  dividerLineDark: {
    backgroundColor: '#2a2a2a',
  },
  dividerText: {
    fontSize: 12,
    color: '#999',
    fontWeight: '300',
  },
  dividerTextDark: {
    color: '#666',
  },
});
