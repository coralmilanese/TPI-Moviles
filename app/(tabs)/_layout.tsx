import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
    const { effectiveTheme } = useTheme();
    const { isAuthenticated } = useAuth();
    const isDark = effectiveTheme === 'dark';

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: isDark ? '#e5e5e5' : '#1a1a1a',
                tabBarInactiveTintColor: isDark ? '#666' : '#999',
                tabBarStyle: {
                    backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
                    borderTopColor: isDark ? '#2a2a2a' : '#e5e5e5',
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Inicio',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="home" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="galeria"
                options={{
                    title: 'Galería',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="photo-library" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="qrScanner"
                options={{
                    title: 'Escanear',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="qr-code-scanner" size={size} color={color} />
                    ),
                }}
            />
            {isAuthenticated && (
                <>
                    <Tabs.Screen
                        name="subir"
                        options={{
                            title: 'Subir',
                            tabBarIcon: ({ color, size }) => (
                                <MaterialIcons name="cloud-upload" size={size} color={color} />
                            ),
                        }}
                    />
                    <Tabs.Screen
                        name="perfil"
                        options={{
                            title: 'Perfil',
                            tabBarIcon: ({ color, size }) => (
                                <MaterialIcons name="person" size={size} color={color} />
                            ),
                        }}
                    />
                </>
            )}
        </Tabs>
    );
}
