
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
  const allIncorrect = params.allIncorrect === 'true';
  const difficulty = params.difficulty as string || 'intermediate';

  console.log('Results screen received params:', {
    score,
    correctAnswers,
    totalQuestions,
    totalTime,
    allIncorrect,
    difficulty
  });

  const getScoreMessage = () => {
    if (allIncorrect) {
      return "¡No te rindas!";
    }
    
    if (score >= 90) return "¡Excelente!";
    if (score >= 70) return "¡Muy bien!";
    if (score >= 50) return "¡Bien hecho!";
    return "¡Sigue practicando!";
  };

  const getScoreColor = () => {
    if (allIncorrect) return '#FF9800';
    if (score >= 90) return '#4CAF50';
    if (score >= 70) return '#8BC34A';
    if (score >= 50) return '#FF9800';
    return '#F44336';
  };

  const getAccuracy = () => {
    if (totalQuestions === 0) {
      console.log('Accuracy calculation: totalQuestions is 0, returning 0');
      return 0;
    }
    const accuracy = Math.round((correctAnswers / totalQuestions) * 100);
    console.log('Accuracy calculation:', {
      correctAnswers,
      totalQuestions,
      calculation: `(${correctAnswers} / ${totalQuestions}) * 100`,
      result: accuracy
    });
    return accuracy;
  };

  const getDifficultyLabel = () => {
    switch (difficulty) {
      case 'easy': return 'Fácil';
      case 'intermediate': return 'Intermedio';
      case 'hard': return 'Difícil';
      default: return 'Intermedio';
    }
  };

  const getDifficultyIcon = () => {
    switch (difficulty) {
      case 'easy': return '😊';
      case 'intermediate': return '🤔';
      case 'hard': return '🧠';
      default: return '🤔';
    }
  };

  return (
    <SafeAreaView style={commonStyles.wrapper}>
      <View style={commonStyles.container}>
        <View style={commonStyles.content}>
          <Text style={commonStyles.title}>Resultados</Text>
          
          {allIncorrect ? (
            <View style={[commonStyles.card, styles.scoreCard]}>
              <Text style={[styles.scoreMessage, { color: getScoreColor() }]}>
                {getScoreMessage()}
              </Text>
              
              <Text style={styles.skippedIcon}>😔</Text>
              
              <Text style={styles.skippedMessage}>
                Todas las respuestas fueron incorrectas
              </Text>
              
              <Text style={styles.encouragementMessage}>
                No obtuviste ninguna respuesta correcta.{'\n'}
                ¡Sigue practicando para mejorar!
              </Text>
            </View>
          ) : (
            <View style={[commonStyles.card, styles.scoreCard]}>
              <Text style={[styles.scoreMessage, { color: getScoreColor() }]}>
                {getScoreMessage()}
              </Text>
              
              <Text style={[styles.scoreValue, { color: getScoreColor() }]}>
                {score} puntos
              </Text>
            </View>
          )}

          <View style={styles.statsContainer}>
            <View style={styles.difficultyContainer}>
              <Text style={styles.difficultyIcon}>{getDifficultyIcon()}</Text>
              <Text style={styles.difficultyText}>
                Nivel: {getDifficultyLabel()}
              </Text>
            </View>

            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Respuestas correctas:</Text>
              <Text style={styles.statValue}>{correctAnswers} de {totalQuestions}</Text>
            </View>
            
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Precisión:</Text>
              <Text style={styles.statValue}>{getAccuracy()}%</Text>
            </View>
            
            {!allIncorrect && (
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Tiempo total:</Text>
                <Text style={styles.statValue}>{totalTime} segundos</Text>
              </View>
            )}
          </View>

          <View style={[commonStyles.buttonContainer, { marginTop: verticalScale(40) }]}>
            <Button
              text="Practicar de nuevo"
              onPress={() => router.push('/setup')}
              style={[buttonStyles.instructionsButton, { marginBottom: verticalScale(20) }]}
            />
            
            <Button
              text="Menú principal"
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
  scoreCard: {
    alignItems: 'center',
    marginTop: verticalScale(20),
    marginBottom: verticalScale(30),
    paddingVertical: verticalScale(30),
  },
  scoreMessage: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    marginBottom: verticalScale(10),
    textAlign: 'center',
  },
  scoreValue: {
    fontSize: moderateScale(36),
    fontWeight: '800',
    textAlign: 'center',
  },
  skippedIcon: {
    fontSize: moderateScale(48),
    marginVertical: verticalScale(15),
  },
  skippedMessage: {
    fontSize: moderateScale(18),
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: verticalScale(15),
  },
  encouragementMessage: {
    fontSize: moderateScale(14),
    color: colors.text,
    textAlign: 'center',
    lineHeight: moderateScale(20),
    paddingHorizontal: scale(20),
    opacity: 0.8,
  },
  statsContainer: {
    width: '100%',
    gap: verticalScale(15),
  },
  difficultyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(10),
    paddingVertical: verticalScale(10),
    backgroundColor: colors.backgroundAlt,
    borderRadius: scale(10),
  },
  difficultyIcon: {
    fontSize: moderateScale(24),
    marginRight: scale(10),
  },
  difficultyText: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: colors.accent,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(15),
    backgroundColor: colors.backgroundAlt,
    borderRadius: scale(8),
  },
  statLabel: {
    fontSize: moderateScale(14),
    color: colors.text,
    fontWeight: '500',
  },
  statValue: {
    fontSize: moderateScale(14),
    color: colors.accent,
    fontWeight: 'bold',
  },
});
