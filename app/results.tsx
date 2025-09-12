
import { Text, View, SafeAreaView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Button from '../components/Button';
import { commonStyles, buttonStyles, scale, verticalScale, moderateScale } from '../styles/commonStyles';
import { StyleSheet } from 'react-native';
import { colors } from '../styles/commonStyles';

export default function ResultsScreen() {
  const params = useLocalSearchParams();
  const score = parseInt(params.score as string) || 0;
  const correctAnswers = parseInt(params.correctAnswers as string) || 0;
  const totalQuestions = parseInt(params.totalQuestions as string) || 0;
  const totalTime = parseInt(params.totalTime as string) || 0;
  const allSkipped = params.allSkipped === 'true';

  console.log('Results screen params:', { score, correctAnswers, totalQuestions, totalTime, allSkipped });

  const getScoreMessage = () => {
    if (allSkipped) {
      return "Omisión de todas las preguntas";
    }
    if (score >= 90) return "¡Excelente trabajo!";
    if (score >= 70) return "¡Muy bien!";
    if (score >= 50) return "¡Buen esfuerzo!";
    return "¡Sigue practicando!";
  };

  const getScoreColor = () => {
    if (allSkipped) return '#9E9E9E';
    if (score >= 90) return '#4CAF50';
    if (score >= 70) return '#FF9800';
    if (score >= 50) return '#FFC107';
    return '#F44336';
  };

  const getAccuracy = () => {
    if (allSkipped || totalQuestions === 0) return 0;
    return Math.round((correctAnswers / totalQuestions) * 100);
  };

  return (
    <SafeAreaView style={commonStyles.wrapper}>
      <View style={commonStyles.container}>
        <View style={commonStyles.content}>
          <Text style={commonStyles.title}>
            {allSkipped ? '¡Sesión Omitida!' : '¡Sesión Completada!'}
          </Text>
          
          <View style={[styles.scoreContainer, { borderColor: getScoreColor() }]}>
            <Text style={[styles.scoreText, { color: getScoreColor() }]}>
              {allSkipped ? '0' : score}
            </Text>
            <Text style={styles.scoreLabel}>
              {allSkipped ? 'omitido' : 'puntos'}
            </Text>
          </View>

          <Text style={[styles.message, { color: getScoreColor() }]}>
            {getScoreMessage()}
          </Text>

          {allSkipped ? (
            <View style={styles.skippedContainer}>
              <Text style={styles.skippedText}>
                No respondiste ninguna pregunta.
              </Text>
              <Text style={styles.skippedSubtext}>
                ¡Inténtalo de nuevo y responde las preguntas para obtener un puntaje!
              </Text>
            </View>
          ) : (
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{correctAnswers}</Text>
                <Text style={styles.statLabel}>Respuestas correctas</Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{totalQuestions}</Text>
                <Text style={styles.statLabel}>Total de preguntas</Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{totalTime}s</Text>
                <Text style={styles.statLabel}>Tiempo total</Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{getAccuracy()}%</Text>
                <Text style={styles.statLabel}>Precisión</Text>
              </View>
            </View>
          )}

          <View style={commonStyles.buttonContainer}>
            <Button
              text="Practicar de Nuevo"
              onPress={() => router.push('/setup')}
              style={[buttonStyles.instructionsButton, { marginBottom: verticalScale(20) }]}
            />
            
            {!allSkipped && (
              <Button
                text="Ver Estadísticas"
                onPress={() => router.push('/statistics')}
                style={[buttonStyles.backButton, { marginBottom: verticalScale(20) }]}
              />
            )}
            
            <Button
              text="Menú Principal"
              onPress={() => router.push('/')}
              style={buttonStyles.backButton}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scoreContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: scale(4),
    borderRadius: scale(75),
    width: scale(130),
    height: scale(130),
    marginVertical: verticalScale(30),
  },
  scoreText: {
    fontSize: moderateScale(30),
    fontWeight: 'bold',
  },
  scoreLabel: {
    fontSize: moderateScale(14),
    color: colors.text,
    marginTop: verticalScale(5),
  },
  message: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: verticalScale(30),
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: verticalScale(40),
    paddingHorizontal: scale(10),
  },
  statItem: {
    alignItems: 'center',
    minWidth: '45%',
    marginBottom: verticalScale(20),
  },
  statValue: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    color: colors.accent,
  },
  statLabel: {
    fontSize: moderateScale(12),
    color: colors.text,
    textAlign: 'center',
    marginTop: verticalScale(5),
  },
  skippedContainer: {
    alignItems: 'center',
    paddingHorizontal: scale(20),
    marginBottom: verticalScale(40),
  },
  skippedText: {
    fontSize: moderateScale(16),
    color: colors.text,
    textAlign: 'center',
    marginBottom: verticalScale(10),
    fontWeight: '600',
  },
  skippedSubtext: {
    fontSize: moderateScale(14),
    color: colors.text,
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: moderateScale(20),
  },
});
