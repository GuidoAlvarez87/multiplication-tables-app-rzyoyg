import { StyleSheet, ViewStyle, TextStyle, Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Responsive scaling functions
const scale = (size: number) => (screenWidth / 375) * size; // Base width: 375 (iPhone X)
const verticalScale = (size: number) => (screenHeight / 812) * size; // Base height: 812 (iPhone X)
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

export const colors = {
  primary: '#162456',    // Material Blue
  secondary: '#193cb8',  // Darker Blue
  accent: '#64B5F6',     // Light Blue
  background: '#101824',  // Keeping dark background
  backgroundAlt: '#162133',  // Keeping dark background
  text: '#e3e3e3',       // Keeping light text
  grey: '#90CAF9',       // Light Blue Grey
  card: '#193cb8',       // Keeping dark card background
};

export const buttonStyles = StyleSheet.create({
  instructionsButton: {
    backgroundColor: colors.primary,
    alignSelf: 'center',
    width: '100%',
  },
  backButton: {
    backgroundColor: colors.backgroundAlt,
    alignSelf: 'center',
    width: '100%',
  },
});

export const commonStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: Math.min(screenWidth * 0.9, 800),
    width: '100%',
    paddingHorizontal: scale(20),
  },
  title: {
    fontSize: moderateScale(24),
    fontWeight: '800',
    textAlign: 'center',
    color: colors.text,
    marginBottom: verticalScale(10),
  },
  text: {
    fontSize: moderateScale(16),
    fontWeight: '500',
    color: colors.text,
    marginBottom: verticalScale(8),
    lineHeight: moderateScale(24),
    textAlign: 'center',
  },
  section: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: scale(20),
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: scale(20),
  },
  card: {
    backgroundColor: colors.backgroundAlt,
    borderColor: colors.grey,
    borderWidth: 1,
    borderRadius: scale(10),
    padding: scale(15),
    marginVertical: verticalScale(8),
    width: '100%',
    boxShadow: '0px 2px 3px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  icon: {
    width: scale(60),
    height: scale(60),
    tintColor: "white",
  },
});

// Export responsive scaling functions for use in other components
export { scale, verticalScale, moderateScale, screenWidth, screenHeight };