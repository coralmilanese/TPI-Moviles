import { useTheme } from '@/contexts/ThemeContext';
import React from 'react';
import { StyleSheet, TextInput, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  error?: boolean;
}

export const Input: React.FC<InputProps> = ({ error, style, ...props }) => {
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === 'dark';

  return (
    <TextInput
      style={[styles.input, isDark && styles.inputDark, error && (isDark ? styles.inputErrorDark : styles.inputError), style]}
      placeholderTextColor={isDark ? '#666' : '#999'}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 15,
    backgroundColor: '#fafafa',
    color: '#1a1a1a',
    fontWeight: '300',
  },
  inputDark: {
    backgroundColor: '#0a0a0a',
    borderColor: '#2a2a2a',
    color: '#e5e5e5',
  },
  inputError: {
    borderColor: '#d32f2f',
  },
  inputErrorDark: {
    borderColor: '#f44336',
  },
});
