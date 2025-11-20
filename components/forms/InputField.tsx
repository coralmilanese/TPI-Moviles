import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Input } from '../common/Input';
import { Label } from '../common/Label';

interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  error?: string;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  error,
  autoCapitalize,
  keyboardType,
}) => {
  return (
    <View style={styles.container}>
      <Label error={!!error}>{label}</Label>
      <Input
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        error={!!error}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
      />
      {error && <Label style={styles.errorText} error>{error}</Label>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
});
