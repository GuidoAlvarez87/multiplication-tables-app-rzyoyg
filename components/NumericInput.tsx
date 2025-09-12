
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { colors, scale, verticalScale, moderateScale } from '../styles/commonStyles';
import Button from './Button';

interface NumericInputProps {
  onSubmit: (value: number) => void;
  disabled?: boolean;
}

export default function NumericInput({ onSubmit, disabled = false }: NumericInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = () => {
    const numValue = parseInt(inputValue);
    if (!isNaN(numValue) && inputValue.trim() !== '') {
      console.log('Submitting answer:', numValue);
      onSubmit(numValue);
    } else {
      console.log('Invalid input:', inputValue);
    }
  };

  const handleInputChange = (text: string) => {
    // Only allow numbers
    const numericText = text.replace(/[^0-9]/g, '');
    setInputValue(numericText);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputValue}
          onChangeText={handleInputChange}
          placeholder="Escribe tu respuesta"
          placeholderTextColor={colors.grey}
          keyboardType="numeric"
          maxLength={4}
          editable={!disabled}
          autoFocus={true}
        />
      </View>
      
      <Button
        text="✓"
        onPress={handleSubmit}
        style={[
          styles.submitButton,
          disabled && styles.disabledButton,
          (!inputValue.trim() || disabled) && styles.disabledButton
        ]}
        textStyle={styles.submitButtonText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    gap: verticalScale(20),
  },
  inputContainer: {
    width: '100%',
    maxWidth: scale(200),
  },
  input: {
    backgroundColor: colors.backgroundAlt,
    borderWidth: 2,
    borderColor: colors.grey,
    borderRadius: scale(12),
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(15),
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    minHeight: verticalScale(60),
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    width: scale(80),
    height: scale(80),
    borderRadius: scale(40),
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  submitButtonText: {
    fontSize: moderateScale(32),
    fontWeight: 'bold',
    color: 'white',
  },
  disabledButton: {
    backgroundColor: colors.grey,
    opacity: 0.5,
  },
});
