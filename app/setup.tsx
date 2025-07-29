import { Text, View, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import Button from '../components/Button';
import { commonStyles, buttonStyles } from '../styles/commonStyles';
import NumberSelector from '../components/NumberSelector';

export default function SetupScreen() {
  const [questionCount, setQuestionCount] = useState(10);
  const [timeLimit, setTimeLimit] = useState(10);

  const startPractice = () => {
    router.push({
      pathname: '/practice',
      params: {
        questionCount: questionCount.toString(),
        timeLimit: timeLimit.toString()
      }
    });
  };

  return (
    <SafeAreaView style={commonStyles.wrapper}>
      <View style={commonStyles.container}>
        <View style={commonStyles.content}>
          <Text style={commonStyles.title}>Configuración</Text>
          
          <View style={[commonStyles.card, { marginTop: 30, marginBottom: 20 }]}>
            <Text style={[commonStyles.text, { marginBottom: 15 }]}>
              Número de preguntas: {questionCount}
            </Text>
            <NumberSelector
              value={questionCount}
              onValueChange={setQuestionCount}
              min={5}
              max={50}
              step={5}
            />
          </View>

          <View style={[commonStyles.card, { marginBottom: 40 }]}>
            <Text style={[commonStyles.text, { marginBottom: 15 }]}>
              Tiempo por pregunta: {timeLimit} segundos
            </Text>
            <NumberSelector
              value={timeLimit}
              onValueChange={setTimeLimit}
              min={5}
              max={15}
              step={1}
            />
          </View>

          <View style={commonStyles.buttonContainer}>
            <Button
              text="Comenzar"
              onPress={startPractice}
              style={[buttonStyles.instructionsButton, { marginBottom: 20 }]}
            />
            
            <Button
              text="Volver"
              onPress={() => router.back()}
              style={buttonStyles.backButton}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}