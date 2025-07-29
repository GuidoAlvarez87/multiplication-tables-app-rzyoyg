import { Text, View, SafeAreaView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Button from '../components/Button';
import { commonStyles, buttonStyles } from '../styles/commonStyles';
import { StyleSheet } from 'react-native';
import { colors } from '../styles/commonStyles';

export default function ResultsScreen() {
  const params = useLocalSearchParams();
  const score = parseInt(params.score as string) || 0;
  const correctAnswers = parseInt(params.correctAnswers as string) || 0;
  const totalQuestions = parseInt(params.totalQuestions as string) || 0;
  const totalTime = parseInt(params.totalTime as string) || 0;

  const getScoreMessage = () => {
    if (score >= 90) return "¡Excelente trabajo!";
    if (score >= 70) return "¡Muy bien!";
    if (score >= 50) return "¡Buen esfuerzo!";
    return "¡Sigue practicando!";
  };

  const getScoreColor = () => {
    if (score >= 90) return '#4CAF50';
    if (score >= 70) return '#FF9800';
    if (score >= 50) return '#FFC107';
    return '#F44336';
  };

  return (
    <SafeAreaView style={commonStyles.wrapper}>
      <View style={commonStyles.container}>
        <View style={commonStyles.content}>
          <Text style={commonStyles.title}>¡Sesión Completada!</Text>
          
          <View style={[styles.scoreContainer, { borderColor: getScoreColor() }]}>
            <Text style={[styles.scoreText, { color: getScoreColor() }]}>
              {score}
            </Text>
            <Text style={styles.scoreLabel}>puntos</Text>
          </View>

          <Text style={[styles.message, { color: getScoreColor() }]}>
            {getScoreMessage()}
          </Text>

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
              <Text style={styles.statValue}>
                {Math.round((correctAnswers / totalQuestions) * 100)}%
              </Text>
              <Text style={styles.statLabel}>Precisión</Text>
            </View>
          </View>

          <View style={commonStyles.buttonContainer}>
            <Button
              text="Practicar de Nuevo"
              onPress={() => router.push('/setup')}
              style={[buttonStyles.instructionsButton, { marginBottom: 20 }]}
            />
            
            <Button
              text="Ver Estadísticas"
              onPress={() => router.push('/statistics')}
              style={[buttonStyles.backButton, { marginBottom: 20 }]}
            />
            
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
    borderWidth: 4,
    borderRadius: 100,
    width: 150,
    height: 150,
    marginVertical: 30,
  },
  scoreText: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  scoreLabel: {
    fontSize: 16,
    color: colors.text,
    marginTop: 5,
  },
  message: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 40,
  },
  statItem: {
    alignItems: 'center',
    minWidth: '45%',
    marginBottom: 20,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.accent,
  },
  statLabel: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
    marginTop: 5,
  },
});