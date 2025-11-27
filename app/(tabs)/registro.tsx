import { RegisterForm } from '@/components/forms/RegisterForm';
import { HamburgerMenu } from '@/components/menu/HamburgerMenu';
import { ThemeToggle } from '@/components/menu/ThemeToggle';
import { useTheme } from '@/contexts/ThemeContext';
import { useRouter } from 'expo-router';
import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RegistroScreen() {
    const { effectiveTheme } = useTheme();
    const router = useRouter();
    const isDark = effectiveTheme === 'dark';

    return (
        <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <View style={[styles.header, isDark && styles.headerDark]}>
                    <HamburgerMenu />
                    <Text style={[styles.headerTitle, isDark && styles.headerTitleDark]}>Crear Cuenta</Text>
                    <ThemeToggle />
                </View>

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.titleContainer}>
                        <Text style={[styles.title, isDark && styles.titleDark]}>
                            Únete al Museo
                        </Text>
                        <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>
                            Crea tu cuenta para disfrutar de todas las funciones
                        </Text>
                    </View>

                    <View style={[styles.formContainer, isDark && styles.formContainerDark]}>
                        <RegisterForm />

                        <TouchableOpacity
                            onPress={() => router.replace('/(tabs)/login')}
                            style={styles.loginLink}
                        >
                            <Text style={[styles.loginLinkText, isDark && styles.loginLinkTextDark]}>
                                ¿Ya tienes cuenta?{' '}
                                <Text style={styles.loginLinkBold}>Inicia sesión</Text>
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
    keyboardView: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: 'transparent',
    },
    headerDark: {
        backgroundColor: 'transparent',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '300',
        color: '#1a1a1a',
        letterSpacing: 1,
    },
    headerTitleDark: {
        color: '#e5e5e5',
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 32,
    },
    titleContainer: {
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
        textAlign: 'center',
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
    loginLink: {
        marginTop: 24,
        alignItems: 'center',
    },
    loginLinkText: {
        fontSize: 14,
        color: '#666',
    },
    loginLinkTextDark: {
        color: '#999',
    },
    loginLinkBold: {
        fontWeight: '600',
        color: '#007AFF',
    },
});
