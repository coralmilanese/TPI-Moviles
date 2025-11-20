import { Button } from '@/components/common/Button';
import { HamburgerMenu } from '@/components/menu/HamburgerMenu';
import { ThemeToggle } from '@/components/menu/ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
    const { user, logout, isAuthenticated } = useAuth();
    const { effectiveTheme } = useTheme();
    const isDark = effectiveTheme === 'dark';
    const router = useRouter();

    React.useEffect(() => {
        if (!isAuthenticated) {
            router.replace('/');
        }
    }, [isAuthenticated, router]);

    const handleLogout = async () => {
        try {
            await logout();
            router.replace('/');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    if (!user) {
        return null;
    }

    return (
        <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
            <View style={[styles.header, isDark && styles.headerDark]}>
                <HamburgerMenu />
                <Text style={[styles.headerTitle, isDark && styles.headerTitleDark]}>Mi Perfil</Text>
                <ThemeToggle />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={[styles.infoCard, isDark && styles.infoCardDark]}>
                    <View style={styles.infoRow}>
                        <Text style={[styles.label, isDark && styles.labelDark]}>Nombre</Text>
                        <Text style={[styles.value, isDark && styles.valueDark]}>{user.nombre}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={[styles.label, isDark && styles.labelDark]}>Email</Text>
                        <Text style={[styles.value, isDark && styles.valueDark]}>{user.email}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={[styles.label, isDark && styles.labelDark]}>Rol</Text>
                        <Text style={[styles.value, styles.roleBadge, isDark && styles.valueDark, isDark && styles.roleBadgeDark]}>
                            {user.rol}
                        </Text>
                    </View>
                </View>

                <Button
                    title="Cerrar Sesión"
                    onPress={handleLogout}
                    variant="secondary"
                    style={styles.logoutButton}
                />
            </ScrollView>
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: 'transparent',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    headerDark: {
        backgroundColor: 'transparent',
        borderBottomColor: '#2a2a2a',
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
    content: {
        padding: 32,
    },
    infoCard: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 24,
        marginBottom: 32,
        borderWidth: 1,
        borderColor: '#e5e5e5',
    },
    infoCardDark: {
        backgroundColor: '#1a1a1a',
        borderColor: '#2a2a2a',
    },
    infoRow: {
        marginBottom: 20,
    },
    label: {
        fontSize: 13,
        fontWeight: '400',
        color: '#757575',
        marginBottom: 8,
        letterSpacing: 0.3,
    },
    labelDark: {
        color: '#999',
    },
    value: {
        fontSize: 16,
        color: '#1a1a1a',
        fontWeight: '300',
    },
    valueDark: {
        color: '#e5e5e5',
    },
    roleBadge: {
        textTransform: 'capitalize',
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: '#f0f0f0',
        borderRadius: 6,
        alignSelf: 'flex-start',
        overflow: 'hidden',
    },
    roleBadgeDark: {
        backgroundColor: '#2a2a2a',
    },
    logoutButton: {
        marginTop: 8,
    },
});
