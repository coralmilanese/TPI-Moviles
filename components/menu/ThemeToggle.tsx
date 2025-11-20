import { useTheme } from '@/contexts/ThemeContext';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export const ThemeToggle: React.FC = () => {
    const { effectiveTheme, setTheme } = useTheme();
    const isDark = effectiveTheme === 'dark';

    const handleToggle = () => {
        setTheme(effectiveTheme === 'light' ? 'dark' : 'light');
    };

    const getIcon = () => {
        return effectiveTheme === 'light' ? '◐' : '◯';
    };

    return (
        <TouchableOpacity onPress={handleToggle} style={styles.button}>
            <Text style={[styles.icon, isDark && styles.iconDark]}>{getIcon()}</Text>
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
    icon: {
        fontSize: 24,
        color: '#1a1a1a',
    },
    iconDark: {
        color: '#e5e5e5',
    },
});
