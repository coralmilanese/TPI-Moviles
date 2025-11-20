import { useTheme } from '@/contexts/ThemeContext';
import React from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';

interface LabelProps extends TextProps {
  error?: boolean;
}

export const Label: React.FC<LabelProps> = ({ children, error, style, ...props }) => {
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === 'dark';

  return (
    <Text style={[styles.label, isDark && styles.labelDark, error && (isDark ? styles.errorLabelDark : styles.errorLabel), style]} {...props}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
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
  errorLabel: {
    color: '#d32f2f',
  },
  errorLabelDark: {
    color: '#f44336',
  },
});
