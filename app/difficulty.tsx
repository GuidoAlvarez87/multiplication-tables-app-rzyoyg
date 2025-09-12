
import { Text, View, SafeAreaView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import Button from '../components/Button';
import { commonStyles, buttonStyles, scale, verticalScale, moderateScale } from '../styles/commonStyles';
import { colors } from '../styles/commonStyles';
import { StyleSheet } from 'react-native';

export default function DifficultyScreen() {
  const params = useLocalSearchParams();
  const questionCount = params.questionCount as string;
  
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);

  const difficulties = [
    {
      id: 'easy',
      title: 'Fácil',
      description: 'Solo 2 alternativas de respuesta',
      timeDescription: '10 segundos por pregunta',
      icon: '😊',
      color: '#4CAF50',
      timeLimit: 10
    },
    {
      id: 'intermediate',
      title: 'Intermedio',
      description: '4 alternativas de respuesta',
      timeDescription: '6 segundos por pregunta',
      icon: '🤔',
      color: '#FF9800',
      timeLimit: 6
    },
    {
      id: 'hard',
      title: 'Difícil',
      description: 'Escribe la respuesta con teclado numérico',
      timeDescription: '4 segundos por pregunta',
      icon: '🧠',
      color: '#F44336',
      timeLimit: 4
    }
  ];

  const handleDifficultySelect = (difficultyId: string) => {
    console.log('Difficulty selected:', difficultyId);
    setSelectedDifficulty(difficultyId);
  };

  const startPractice = () => {
    if (!selectedDifficulty) {
      console.log('No difficulty selected');
      return;
    }
    
    const selectedDifficultyData = difficulties.find(d => d.id === selectedDifficulty);
    const timeLimit = selectedDifficultyData?.timeLimit || 5;
    
    console.log('Starting practice with difficulty:', selectedDifficulty, 'and time limit:', timeLimit);
    router.push({
      pathname: '/practice',
      params: {
        questionCount,
        timeLimit: timeLimit.toString(),
        difficulty: selectedDifficulty
      }
    });
  };

  const handleGoBack = () => {
    console.log('Going back to setup');
    router.back();
  };

  return (
    <SafeAreaView style={commonStyles.wrapper}>
      <View style={commonStyles.container}>
        <View style={commonStyles.content}>
          <Text style={commonStyles.title}>Nivel de Dificultad</Text>
          
          <Text style={[commonStyles.text, { marginBottom: verticalScale(30), opacity: 0.8 }]}>
            Selecciona el nivel que prefieras
          </Text>

          <View style={styles.difficultiesContainer}>
            {difficulties.map((difficulty) => (
              <Button
                key={difficulty.id}
                text=""
                onPress={() => handleDifficultySelect(difficulty.id)}
                style={[
                  styles.difficultyButton,
                  selectedDifficulty === difficulty.id && [
                    styles.selectedDifficulty,
                    { borderColor: difficulty.color }
                  ]
                ]}
              >
                <View style={styles.difficultyContent}>
                  <Text style={styles.difficultyIcon}>{difficulty.icon}</Text>
                  <View style={styles.difficultyTextContainer}>
                    <Text style={[
                      styles.difficultyTitle,
                      selectedDifficulty === difficulty.id && { color: difficulty.color }
                    ]}>
                      {difficulty.title}
                    </Text>
                    <Text style={[
                      styles.difficultyDescription,
                      selectedDifficulty === difficulty.id && { opacity: 1 }
                    ]}>
                      {difficulty.description}
                    </Text>
                    <Text style={[
                      styles.timeDescription,
                      selectedDifficulty === difficulty.id && { opacity: 1, color: difficulty.color }
                    ]}>
                      {difficulty.timeDescription}
                    </Text>
                  </View>
                  {selectedDifficulty === difficulty.id && (
                    <Text style={[styles.checkmark, { color: difficulty.color }]}>✓</Text>
                  )}
                </View>
              </Button>
            ))}
          </View>

          <View style={[commonStyles.buttonContainer, { marginTop: verticalScale(40) }]}>
            <Button
              text="Comenzar Práctica"
              onPress={startPractice}
              style={[
                buttonStyles.instructionsButton,
                { 
                  marginBottom: verticalScale(20),
                  opacity: selectedDifficulty ? 1 : 0.5
                }
              ]}
            />
            
            <Button
              text="Volver"
              onPress={handleGoBack}
              style={buttonStyles.backButton}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  difficultiesContainer: {
    width: '100%',
    gap: verticalScale(15),
  },
  difficultyButton: {
    backgroundColor: colors.backgroundAlt,
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: scale(15),
    padding: scale(20),
    width: '100%',
    minHeight: verticalScale(90),
  },
  selectedDifficulty: {
    backgroundColor: colors.card,
    borderWidth: 2,
  },
  difficultyContent: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  difficultyIcon: {
    fontSize: moderateScale(32),
    marginRight: scale(15),
  },
  difficultyTextContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  difficultyTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: verticalScale(3),
  },
  difficultyDescription: {
    fontSize: moderateScale(14),
    color: colors.text,
    opacity: 0.7,
    textAlign: 'left',
    marginBottom: verticalScale(2),
  },
  timeDescription: {
    fontSize: moderateScale(12),
    color: colors.accent,
    opacity: 0.8,
    fontWeight: '600',
    textAlign: 'left',
  },
  checkmark: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    marginLeft: scale(10),
  },
});
