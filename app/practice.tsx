
import { Text, View, SafeAreaView, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useState, useEffect, useRef } from 'react';
import Button from '../components/Button';
import NumericInput from '../components/NumericInput';
import { commonStyles, buttonStyles, scale, verticalScale, moderateScale, screenWidth, screenHeight } from '../styles/commonStyles';
import { StyleSheet } from 'react-native';
import { colors } from '../styles/commonStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Question {
  num1: number;
  num2: number;
  correctAnswer: number;
  options: number[];
}

export default function PracticeScreen() {
  const params = useLocalSearchParams();
  const questionCount = parseInt(params.questionCount as string) || 10;
  const timeLimit = parseInt(params.timeLimit as string) || 10;
  const difficulty = params.difficulty as string || 'intermediate';
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [totalTime, setTotalTime] = useState(0);
  const [sessionStartTime] = useState(Date.now());
  const [answeredQuestions, setAnsweredQuestions] = useState(0);
  const [isFinishing, setIsFinishing] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const questionStartTime = useRef(Date.now());
  const correctAnswersRef = useRef(0);

  useEffect(() => {
    console.log('Practice screen mounted with params:', { questionCount, timeLimit, difficulty });
    generateQuestions();
    startTimer();
    return () => {
      if (timerRef.current) {
        console.log('Cleaning up timer');
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const generateQuestions = () => {
    console.log('Generating questions for difficulty:', difficulty);
    const newQuestions: Question[] = [];
    
    for (let i = 0; i < questionCount; i++) {
      const num1 = Math.floor(Math.random() * 12) + 1;
      const num2 = Math.floor(Math.random() * 12) + 1;
      const correctAnswer = num1 * num2;
      
      let optionsCount = 4;
      if (difficulty === 'easy') {
        optionsCount = 2;
      } else if (difficulty === 'hard') {
        optionsCount = 0;
      }
      
      const options = [correctAnswer];
      
      if (optionsCount > 0) {
        while (options.length < optionsCount) {
          const wrongAnswer = correctAnswer + Math.floor(Math.random() * 20) - 10;
          if (wrongAnswer > 0 && !options.includes(wrongAnswer)) {
            options.push(wrongAnswer);
          }
        }
        
        for (let j = options.length - 1; j > 0; j--) {
          const k = Math.floor(Math.random() * (j + 1));
          [options[j], options[k]] = [options[k], options[j]];
        }
      }
      
      newQuestions.push({ num1, num2, correctAnswer, options });
    }
    
    setQuestions(newQuestions);
    console.log('Generated', newQuestions.length, 'questions for', difficulty, 'difficulty');
  };

  const startTimer = () => {
    questionStartTime.current = Date.now();
    setTimeLeft(timeLimit);
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleTimeUp = () => {
    console.log('Time up for question - marking as unanswered/incorrect');
    if (timerRef.current) clearInterval(timerRef.current);
    
    const responseTime = Date.now() - questionStartTime.current;
    setTotalTime(prev => prev + responseTime);
    
    setAnsweredQuestions(prev => prev + 1);
    
    setSelectedAnswer(-1);
    setShowResult(true);
    
    console.log('Question timed out. Total correct remains:', correctAnswersRef.current);
    
    setTimeout(() => {
      nextQuestion();
    }, 1500);
  };

  const handleAnswerSelect = (answer: number) => {
    if (selectedAnswer !== null || isFinishing) return;
    
    console.log('Answer selected:', answer, 'Correct answer:', questions[currentQuestion]?.correctAnswer);
    if (timerRef.current) clearInterval(timerRef.current);
    
    const responseTime = Date.now() - questionStartTime.current;
    setTotalTime(prev => prev + responseTime);
    setAnsweredQuestions(prev => prev + 1);
    
    setSelectedAnswer(answer);
    setShowResult(true);
    
    if (questions[currentQuestion] && answer === questions[currentQuestion].correctAnswer) {
      correctAnswersRef.current += 1;
      setCorrectAnswersCount(prev => prev + 1);
      console.log('Correct answer! Total correct now:', correctAnswersRef.current);
    } else {
      console.log('Incorrect answer. Total correct remains:', correctAnswersRef.current);
    }
    
    setTimeout(() => {
      nextQuestion();
    }, 1500);
  };

  const handleNumericSubmit = (answer: number) => {
    handleAnswerSelect(answer);
  };

  const nextQuestion = () => {
    if (isFinishing) {
      console.log('Already finishing session, skipping nextQuestion');
      return;
    }
    
    if (currentQuestion + 1 >= questionCount) {
      console.log('Session finished');
      finishSession();
      return;
    }
    
    console.log('Moving to next question');
    setCurrentQuestion(prev => prev + 1);
    setSelectedAnswer(null);
    setShowResult(false);
    startTimer();
  };

  const handleExitSession = () => {
    console.log('Exit session requested');
    Alert.alert(
      'Salir de la sesión',
      '¿Estás seguro de que quieres salir? Se perderá el progreso actual.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
          onPress: () => console.log('Exit cancelled'),
        },
        {
          text: 'Salir',
          style: 'destructive',
          onPress: () => {
            console.log('Exiting session');
            if (timerRef.current) clearInterval(timerRef.current);
            router.push('/');
          },
        },
      ]
    );
  };

  const finishSession = async () => {
    if (isFinishing) {
      console.log('Already finishing session, skipping duplicate call');
      return;
    }
    
    setIsFinishing(true);
    console.log('Finishing session...');
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    const finalCorrectAnswers = correctAnswersRef.current;
    
    console.log('Final stats:', {
      correctAnswersCount: finalCorrectAnswers,
      questionCount,
      answeredQuestions,
      totalTime
    });
    
    const sessionEndTime = Date.now();
    const sessionDuration = sessionEndTime - sessionStartTime;
    
    const allIncorrect = finalCorrectAnswers === 0;
    console.log('All incorrect:', allIncorrect);
    
    let finalScore = 0;
    if (finalCorrectAnswers > 0) {
      const baseScore = (finalCorrectAnswers / questionCount) * 100;
      const timeBonus = Math.max(0, 1 - totalTime / (questionCount * timeLimit * 1000));
      finalScore = Math.round(baseScore * (1 + timeBonus * 0.5));
      console.log('Score calculation:', {
        baseScore,
        timeBonus,
        finalScore,
        finalCorrectAnswers,
        questionCount
      });
    }
    
    try {
      const sessionData = {
        date: new Date().toISOString(),
        score: finalScore,
        correctAnswers: finalCorrectAnswers,
        totalQuestions: questionCount,
        totalTime: sessionDuration,
        averageResponseTime: answeredQuestions > 0 ? totalTime / answeredQuestions : 0,
        allIncorrect: allIncorrect,
        difficulty: difficulty
      };
      
      const existingSessions = await AsyncStorage.getItem('sessions');
      const sessions = existingSessions ? JSON.parse(existingSessions) : [];
      sessions.push(sessionData);
      
      await AsyncStorage.setItem('sessions', JSON.stringify(sessions));
      
      const today = new Date().toISOString().split('T')[0];
      const weeklyUsage = await AsyncStorage.getItem('weeklyUsage');
      const usage = weeklyUsage ? JSON.parse(weeklyUsage) : {};
      usage[today] = (usage[today] || 0) + sessionDuration;
      
      await AsyncStorage.setItem('weeklyUsage', JSON.stringify(usage));
      console.log('Session data saved successfully');
    } catch (error) {
      console.log('Error saving session data:', error);
    }
    
    console.log('Navigating to results with params:', {
      score: finalScore,
      correctAnswers: finalCorrectAnswers,
      totalQuestions: questionCount,
      totalTime: Math.round(totalTime / 1000),
      allIncorrect: allIncorrect,
      difficulty: difficulty
    });
    
    router.push({
      pathname: '/results',
      params: {
        score: finalScore.toString(),
        correctAnswers: finalCorrectAnswers.toString(),
        totalQuestions: questionCount.toString(),
        totalTime: Math.round(totalTime / 1000).toString(),
        allIncorrect: allIncorrect.toString(),
        difficulty: difficulty
      }
    });
  };

  const getButtonStyle = (option: number) => {
    if (!showResult || !questions[currentQuestion]) return styles.optionButton;
    
    const currentQ = questions[currentQuestion];
    
    if (selectedAnswer === -1) {
      if (option === currentQ.correctAnswer) {
        return [styles.optionButton, styles.correctButton];
      }
      return styles.optionButton;
    }
    
    if (option === selectedAnswer) {
      return option === currentQ.correctAnswer
        ? [styles.optionButton, styles.correctButton]
        : [styles.optionButton, styles.incorrectButton];
    }
    
    if (option === currentQ.correctAnswer) {
      return [styles.optionButton, styles.correctButton];
    }
    
    return styles.optionButton;
  };

  const getDifficultyLabel = () => {
    switch (difficulty) {
      case 'easy': return 'Fácil';
      case 'intermediate': return 'Intermedio';
      case 'hard': return 'Difícil';
      default: return 'Intermedio';
    }
  };

  if (questions.length === 0 || isFinishing) {
    return (
      <SafeAreaView style={commonStyles.wrapper}>
        <View style={commonStyles.container}>
          <Text style={commonStyles.text}>
            {isFinishing ? 'Finalizando sesión...' : 'Cargando preguntas...'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const currentQ = questions[currentQuestion];
  
  if (!currentQ) {
    console.log('Current question is undefined, currentQuestion:', currentQuestion, 'questions.length:', questions.length);
    return (
      <SafeAreaView style={commonStyles.wrapper}>
        <View style={commonStyles.container}>
          <Text style={commonStyles.text}>Cargando pregunta...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={commonStyles.wrapper}>
      <View style={commonStyles.container}>
        <View style={commonStyles.content}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.questionCounter}>
                Pregunta {currentQuestion + 1} de {questionCount}
              </Text>
              <Text style={styles.difficultyLabel}>
                {getDifficultyLabel()}
              </Text>
            </View>
            <View style={styles.headerCenter}>
              <Text style={[styles.timer, timeLeft <= 3 && styles.timerWarning]}>
                {timeLeft}s
              </Text>
            </View>
            <View style={styles.headerRight}>
              <Button
                text="Salir"
                onPress={handleExitSession}
                style={styles.exitButton}
                textStyle={styles.exitButtonText}
              />
            </View>
          </View>

          <View style={styles.questionContainer}>
            <Text style={styles.question}>
              {currentQ.num1} × {currentQ.num2} = ?
            </Text>
          </View>

          <View style={styles.answerContainer}>
            {difficulty === 'hard' ? (
              <NumericInput
                onSubmit={handleNumericSubmit}
                disabled={showResult}
              />
            ) : (
              <View style={styles.optionsContainer}>
                {currentQ.options.map((option, index) => (
                  <Button
                    key={index}
                    text={option.toString()}
                    onPress={() => handleAnswerSelect(option)}
                    style={getButtonStyle(option)}
                    textStyle={styles.optionText}
                  />
                ))}
              </View>
            )}
          </View>

          {showResult && difficulty === 'hard' && (
            <View style={styles.resultContainer}>
              <Text style={[
                styles.resultText,
                selectedAnswer === currentQ.correctAnswer ? styles.correctText : styles.incorrectText
              ]}>
                {selectedAnswer === -1 
                  ? `Tiempo agotado! La respuesta era: ${currentQ.correctAnswer}`
                  : selectedAnswer === currentQ.correctAnswer 
                    ? '¡Correcto! ✓' 
                    : `Incorrecto. La respuesta era: ${currentQ.correctAnswer}`
                }
              </Text>
            </View>
          )}

          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${((currentQuestion + 1) / questionCount) * 100}%` }
                ]} 
              />
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: scale(10),
    marginBottom: verticalScale(15),
    height: verticalScale(60),
    minHeight: 50,
  },
  headerLeft: {
    flex: 1,
    alignItems: 'flex-start',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  questionCounter: {
    fontSize: moderateScale(11),
    color: colors.text,
    fontWeight: '600',
  },
  difficultyLabel: {
    fontSize: moderateScale(9),
    color: colors.accent,
    fontWeight: '500',
    marginTop: verticalScale(2),
  },
  timer: {
    fontSize: moderateScale(14),
    color: colors.accent,
    fontWeight: 'bold',
    backgroundColor: colors.backgroundAlt,
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(3),
    borderRadius: scale(10),
    minWidth: scale(40),
    textAlign: 'center',
  },
  timerWarning: {
    color: '#FF5252',
    backgroundColor: '#FFEBEE',
  },
  exitButton: {
    backgroundColor: '#F44336',
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(3),
    borderRadius: scale(10),
    minWidth: scale(45),
    height: verticalScale(28),
    justifyContent: 'center',
    alignItems: 'center',
  },
  exitButtonText: {
    fontSize: moderateScale(10),
    fontWeight: '600',
    color: 'white',
  },
  questionContainer: {
    alignItems: 'center',
    marginBottom: verticalScale(25),
    paddingHorizontal: scale(15),
    flex: 0.25,
    justifyContent: 'center',
    minHeight: verticalScale(80),
  },
  question: {
    fontSize: moderateScale(screenHeight < 700 ? 22 : 28),
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    lineHeight: moderateScale(screenHeight < 700 ? 28 : 36),
  },
  answerContainer: {
    width: '100%',
    paddingHorizontal: scale(15),
    flex: 0.45,
    justifyContent: 'center',
  },
  optionsContainer: {
    width: '100%',
    gap: verticalScale(8),
    justifyContent: 'center',
  },
  optionButton: {
    backgroundColor: colors.primary,
    paddingVertical: verticalScale(12),
    borderRadius: scale(12),
    marginBottom: 0,
    minHeight: verticalScale(45),
    justifyContent: 'center',
  },
  optionText: {
    fontSize: moderateScale(15),
    fontWeight: 'bold',
  },
  correctButton: {
    backgroundColor: '#4CAF50',
  },
  incorrectButton: {
    backgroundColor: '#F44336',
  },
  resultContainer: {
    width: '100%',
    paddingHorizontal: scale(15),
    alignItems: 'center',
    marginTop: verticalScale(10),
  },
  resultText: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  correctText: {
    color: '#4CAF50',
  },
  incorrectText: {
    color: '#F44336',
  },
  progressContainer: {
    width: '100%',
    paddingHorizontal: scale(15),
    marginTop: verticalScale(15),
    flex: 0.1,
    justifyContent: 'flex-end',
    paddingBottom: verticalScale(10),
  },
  progressBar: {
    height: verticalScale(6),
    backgroundColor: colors.backgroundAlt,
    borderRadius: scale(3),
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: scale(3),
  },
});
