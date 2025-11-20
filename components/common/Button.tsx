import { useTheme } from '@/contexts/ThemeContext';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary';
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  loading = false,
  disabled,
  style,
  ...props
}) => {
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === 'dark';
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === 'primary' ? [styles.primaryButton, isDark && styles.primaryButtonDark] : [styles.secondaryButton, isDark && styles.secondaryButtonDark],
        isDisabled && styles.disabledButton,
        style,
      ]}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? (isDark ? '#1a1a1a' : '#fff') : (isDark ? '#e5e5e5' : '#1a1a1a')} />
      ) : (
        <Text
          style={[
            styles.buttonText,
            variant === 'primary' ? [styles.primaryButtonText, isDark && styles.primaryButtonTextDark] : [styles.secondaryButtonText, isDark && styles.secondaryButtonTextDark],
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  primaryButton: {
    backgroundColor: '#1a1a1a',
  },
  primaryButtonDark: {
    backgroundColor: '#e5e5e5',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#1a1a1a',
  },
  secondaryButtonDark: {
    borderColor: '#e5e5e5',
  },
  disabledButton: {
    opacity: 0.4,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '400',
    letterSpacing: 0.5,
  },
  primaryButtonText: {
    color: '#ffffff',
  },
  primaryButtonTextDark: {
    color: '#1a1a1a',
  },
  secondaryButtonText: {
    color: '#1a1a1a',
  },
  secondaryButtonTextDark: {
    color: '#e5e5e5',
  },
});
