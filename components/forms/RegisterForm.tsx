import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Button } from '../common/Button';
import { InputField } from './InputField';

export const RegisterForm: React.FC = () => {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState<{
        nombre?: string;
        email?: string;
        password?: string;
        confirmPassword?: string;
    }>({});
    const [isLoading, setIsLoading] = useState(false);

    const { register } = useAuth();
    const { effectiveTheme } = useTheme();
    const router = useRouter();
    const isDark = effectiveTheme === 'dark';

    const validateForm = (): boolean => {
        const newErrors: {
            nombre?: string;
            email?: string;
            password?: string;
            confirmPassword?: string;
        } = {};

        if (!nombre.trim()) {
            newErrors.nombre = 'El nombre es requerido';
        } else if (nombre.trim().length < 2) {
            newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
        }

        if (!email) {
            newErrors.email = 'El email es requerido';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email inválido';
        }

        if (!password) {
            newErrors.password = 'La contraseña es requerida';
        } else if (password.length < 6) {
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = 'Debes confirmar la contraseña';
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = async () => {
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        try {
            await register(nombre.trim(), email.trim(), password);

            Alert.alert(
                '¡Éxito!',
                'Tu cuenta ha sido creada correctamente. Ahora puedes iniciar sesión.',
                [
                    {
                        text: 'OK',
                        onPress: () => router.replace('/(tabs)/login'),
                    },
                ]
            );
        } catch (error) {
            Alert.alert(
                'Error',
                error instanceof Error ? error.message : 'Error al crear la cuenta'
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <InputField
                label="Nombre completo"
                value={nombre}
                onChangeText={(text) => {
                    setNombre(text);
                    if (errors.nombre) setErrors({ ...errors, nombre: undefined });
                }}
                autoCapitalize="words"
                error={errors.nombre}
            />

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

            <InputField
                label="Confirmar contraseña"
                value={confirmPassword}
                onChangeText={(text) => {
                    setConfirmPassword(text);
                    if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
                }}
                secureTextEntry
                autoCapitalize="none"
                error={errors.confirmPassword}
            />

            <View style={styles.infoContainer}>
                <Text style={[styles.infoText, isDark && styles.infoTextDark]}>
                    • Mínimo 6 caracteres para la contraseña
                </Text>
                <Text style={[styles.infoText, isDark && styles.infoTextDark]}>
                    • Usa un email válido para recuperar tu cuenta
                </Text>
            </View>

            <Button
                title="Crear Cuenta"
                onPress={handleRegister}
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
    infoContainer: {
        marginTop: 8,
        marginBottom: 16,
        paddingHorizontal: 4,
    },
    infoText: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },
    infoTextDark: {
        color: '#999',
    },
});
