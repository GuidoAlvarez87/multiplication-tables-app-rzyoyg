import { Text, View, SafeAreaView, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useState, useEffect, useRef } from 'react';
import Button from '../components/Button';
import { commonStyles, buttonStyles } from '../styles/commonStyles';
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
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [totalTime, setTotalTime] = useState(0);
  const [sessionStartTime] = useState(Date.now());
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const questionStartTime = useRef(Date.now());

  useEffect(() => {
    console.log('Practice screen mounted with params:', { questionCount, timeLimit });
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
    console.log('Generating questions...');
    const newQuestions: Question[] = [];
    
    for (let i = 0; i < questionCount; i++) {
      const num1 = Math.floor(Math.random() * 12) + 1;
      const num2 = Math.floor(Math.random() * 12) + 1;
      const correctAnswer = num1 * num2;
      
      const options = [correctAnswer];
      while (options.length < 4) {
        const wrongAnswer = correctAnswer + Math.floor(Math.random() * 20) - 10;
        if (wrongAnswer > 0 && !options.includes(wrongAnswer)) {
          options.push(wrongAnswer);
        }
      }
      
      // Shuffle options
      for (let j = options.length - 1; j > 0; j--) {
        const k = Math.floor(Math.random() * (j + 1));
        [options[j], options[k]] = [options[k], options[j]];
      }
      
      newQuestions.push({ num1, num2, correctAnswer, options });
    }
    
    setQuestions(newQuestions);
    console.log('Generated', newQuestions.length, 'questions');
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
    console.log('Time up for question');
    if (timerRef.current) clearInterval(timerRef.current);
    setSelectedAnswer(-1); // Mark as timeout
    setShowResult(true);
    
    setTimeout(() => {
      nextQuestion();
    }, 1500);
  };

  const handleAnswerSelect = (answer: number) => {
    if (selectedAnswer !== null) return;
    
    console.log('Answer selected:', answer);
    if (timerRef.current) clearInterval(timerRef.current);
    
    const responseTime = Date.now() - questionStartTime.current;
    setTotalTime(prev => prev + responseTime);
    
    setSelectedAnswer(answer);
    setShowResult(true);
    
    if (answer === questions[currentQuestion].correctAnswer) {
      setScore(prev => prev + 1);
      console.log('Correct answer!');
    } else {
      console.log('Incorrect answer');
    }
    
    setTimeout(() => {
      nextQuestion();
    }, 1500);
  };

  const nextQuestion = () => {
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
    console.log('Finishing session...');
    const sessionEndTime = Date.now();
    const sessionDuration = sessionEndTime - sessionStartTime;
    const finalScore = Math.round((score / questionCount) * 100 * (1 - totalTime / (questionCount * timeLimit * 1000)) * 100);
    
    // Save session data
    try {
      const sessionData = {
        date: new Date().toISOString(),
        score: finalScore,
        correctAnswers: score,
        totalQuestions: questionCount,
        totalTime: sessionDuration,
        averageResponseTime: totalTime / questionCount
      };
      
      const existingSessions = await AsyncStorage.getItem('sessions');
      const sessions = existingSessions ? JSON.parse(existingSessions) : [];
      sessions.push(sessionData);
      
      await AsyncStorage.setItem('sessions', JSON.stringify(sessions));
      
      // Update weekly usage
      const today = new Date().toISOString().split('T')[0];
      const weeklyUsage = await AsyncStorage.getItem('weeklyUsage');
      const usage = weeklyUsage ? JSON.parse(weeklyUsage) : {};
      usage[today] = (usage[today] || 0) + sessionDuration;
      
      await AsyncStorage.setItem('weeklyUsage', JSON.stringify(usage));
      console.log('Session data saved successfully');
    } catch (error) {
      console.log('Error saving session data:', error);
    }
    
    router.push({
      pathname: '/results',
      params: {
        score: finalScore.toString(),
        correctAnswers: score.toString(),
        totalQuestions: questionCount.toString(),
        totalTime: Math.round(totalTime / 1000).toString()
      }
    });
  };

  const getButtonStyle = (option: number) => {
    if (!showResult) return styles.optionButton;
    
    if (selectedAnswer === -1) {
      // Timeout case
      if (option === questions[currentQuestion].correctAnswer) {
        return [styles.optionButton, styles.correctButton];
      }
      return styles.optionButton;
    }
    
    if (option === selectedAnswer) {
      return option === questions[currentQuestion].correctAnswer
        ? [styles.optionButton, styles.correctButton]
        : [styles.optionButton, styles.incorrectButton];
    }
    
    if (option === questions[currentQuestion].correctAnswer) {
      return [styles.optionButton, styles.correctButton];
    }
    
    return styles.optionButton;
  };

  if (questions.length === 0) {
    return (
      <SafeAreaView style={commonStyles.wrapper}>
        <View style={commonStyles.container}>
          <Text style={commonStyles.text}>Cargando preguntas...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <SafeAreaView style={commonStyles.wrapper}>
      <View style={commonStyles.container}>
        <View style={commonStyles.content}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.questionCounter}>
                Pregunta {currentQuestion + 1} de {questionCount}
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
    paddingHorizontal: 20,
    marginBottom: 20,
    height: 50,
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
    fontSize: 12,
    color: colors.text,
    fontWeight: '600',
  },
  timer: {
    fontSize: 16,
    color: colors.accent,
    fontWeight: 'bold',
    backgroundColor: colors.backgroundAlt,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  timerWarning: {
    color: '#FF5252',
    backgroundColor: '#FFEBEE',
  },
  exitButton: {
    backgroundColor: '#F44336',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 50,
    height: 32,
  },
  exitButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: 'white',
  },
  questionContainer: {
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  question: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    lineHeight: 36,
  },
  optionsContainer: {
    width: '100%',
    paddingHorizontal: 20,
    gap: 10,
  },
  optionButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 0,
  },
  optionText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  correctButton: {
    backgroundColor: '#4CAF50',
  },
  incorrectButton: {
    backgroundColor: '#F44336',
  },
  progressContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 3,
  },
});