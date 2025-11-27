import { useTheme } from '@/contexts/ThemeContext';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LoginForm } from '../components/forms/LoginForm';

export default function LoginScreen() {
    const router = useRouter();
    const { effectiveTheme } = useTheme();
    const isDark = effectiveTheme === 'dark';

    return (
        <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <View style={[styles.backButtonContainer, isDark && styles.backButtonContainerDark]}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <Text style={[styles.backButtonText, isDark && styles.backButtonTextDark]}>← Volver</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.header}>
                        <Text style={[styles.title, isDark && styles.titleDark]}>Bienvenido</Text>
                        <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>Inicia sesión para continuar</Text>
                    </View>
                    <View style={[styles.formContainer, isDark && styles.formContainerDark]}>
                        <LoginForm />
                        <TouchableOpacity
                            onPress={() => router.push('/registro')}
                            style={styles.registerLink}
                        >
                            <Text style={[styles.registerLinkText, isDark && styles.registerLinkTextDark]}>
                                ¿No tienes cuenta?{' '}
                                <Text style={styles.registerLinkBold}>Regístrate</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fafafa',
    },
    containerDark: {
        backgroundColor: '#0a0a0a',
    },
    backButtonContainer: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: 'transparent',
    },
    backButtonContainerDark: {
        backgroundColor: 'transparent',
    },
    backButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        alignSelf: 'flex-start',
    },
    backButtonText: {
        fontSize: 15,
        color: '#1a1a1a',
        fontWeight: '300',
    },
    backButtonTextDark: {
        color: '#e5e5e5',
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 32,
    },
    header: {
        alignItems: 'center',
        marginBottom: 56,
    },
    title: {
        fontSize: 32,
        fontWeight: '200',
        color: '#1a1a1a',
        marginBottom: 12,
        letterSpacing: 0.5,
    },
    titleDark: {
        color: '#e5e5e5',
    },
    subtitle: {
        fontSize: 15,
        color: '#757575',
        fontWeight: '300',
    },
    subtitleDark: {
        color: '#999',
    },
    formContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 32,
        borderWidth: 1,
        borderColor: '#e5e5e5',
    },
    formContainerDark: {
        backgroundColor: '#1a1a1a',
        borderColor: '#2a2a2a',
    },
    registerLink: {
        marginTop: 24,
        alignItems: 'center',
    },
    registerLinkText: {
        fontSize: 14,
        color: '#666',
    },
    registerLinkTextDark: {
        color: '#999',
    },
    registerLinkBold: {
        fontWeight: '600',
        color: '#007AFF',
    },
});