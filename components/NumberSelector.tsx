import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, scale, verticalScale, moderateScale } from '../styles/commonStyles';

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
    width: scale(45),
    height: scale(45),
    borderRadius: scale(22.5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: colors.backgroundAlt,
    opacity: 0.5,
  },
  buttonText: {
    color: colors.text,
    fontSize: moderateScale(20),
    fontWeight: 'bold',
  },
  buttonTextDisabled: {
    color: colors.grey,
  },
  valueContainer: {
    backgroundColor: colors.background,
    paddingHorizontal: scale(25),
    paddingVertical: verticalScale(12),
    marginHorizontal: scale(15),
    borderRadius: scale(8),
    borderWidth: 1,
    borderColor: colors.grey,
    minWidth: scale(60),
  },
  valueText: {
    color: colors.text,
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    textAlign: 'center',
  },
});