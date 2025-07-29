import { Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors, scale, verticalScale, moderateScale } from '../styles/commonStyles';

interface ButtonProps {
  text: string;
  onPress: () => void;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle;
}

export default function Button({ text, onPress, style, textStyle }: ButtonProps) {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress} activeOpacity={0.7}>
      <Text style={[styles.buttonText, textStyle]}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    padding: scale(14),
    borderRadius: scale(8),
    marginTop: verticalScale(10),
    width: '100%',
    boxShadow: '0px 2px 3.84px rgba(0, 0, 0, 0.25)',
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: verticalScale(48),
  },
  buttonText: {
    color: '#fff',
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    textAlign: 'center',
  },
});