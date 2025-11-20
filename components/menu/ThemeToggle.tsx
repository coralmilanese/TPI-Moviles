import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

export const ThemeToggle: React.FC = () => {
    const { effectiveTheme, setTheme } = useTheme();
    const isDark = effectiveTheme === 'dark';

    const handleToggle = () => {
        setTheme(effectiveTheme === 'light' ? 'dark' : 'light');
    };

    return (
        <TouchableOpacity onPress={handleToggle} style={styles.button}>
            <Ionicons
                name={effectiveTheme === 'light' ? 'sunny-outline' : 'moon-outline'}
                size={22}
                color={isDark ? '#e5e5e5' : '#1a1a1a'}
            />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
