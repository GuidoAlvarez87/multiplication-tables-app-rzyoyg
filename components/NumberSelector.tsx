import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../styles/commonStyles';

interface NumberSelectorProps {
  value: number;
  onValueChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
}

export default function NumberSelector({ value, onValueChange, min, max, step }: NumberSelectorProps) {
  const decrease = () => {
    if (value > min) {
      onValueChange(value - step);
    }
  };

  const increase = () => {
    if (value < max) {
      onValueChange(value + step);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.button, value <= min && styles.buttonDisabled]} 
        onPress={decrease}
        disabled={value <= min}
      >
        <Text style={[styles.buttonText, value <= min && styles.buttonTextDisabled]}>-</Text>
      </TouchableOpacity>
      
      <View style={styles.valueContainer}>
        <Text style={styles.valueText}>{value}</Text>
      </View>
      
      <TouchableOpacity 
        style={[styles.button, value >= max && styles.buttonDisabled]} 
        onPress={increase}
        disabled={value >= max}
      >
        <Text style={[styles.buttonText, value >= max && styles.buttonTextDisabled]}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: colors.primary,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: colors.backgroundAlt,
    opacity: 0.5,
  },
  buttonText: {
    color: colors.text,
    fontSize: 24,
    fontWeight: 'bold',
  },
  buttonTextDisabled: {
    color: colors.grey,
  },
  valueContainer: {
    backgroundColor: colors.background,
    paddingHorizontal: 30,
    paddingVertical: 15,
    marginHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.grey,
  },
  valueText: {
    color: colors.text,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});