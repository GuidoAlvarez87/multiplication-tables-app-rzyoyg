import { Text, View, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import Button from '../components/Button';
import { commonStyles, buttonStyles, scale, verticalScale, moderateScale } from '../styles/commonStyles';
import NumberSelector from '../components/NumberSelector';

export default function SetupScreen() {
  const [questionCount, setQuestionCount] = useState(10);
  const [timeLimit, setTimeLimit] = useState(10);

  const startPractice = () => {
    console.log('Starting practice with:', { questionCount, timeLimit });
    router.push({
      pathname: '/practice',
      params: {
        questionCount: questionCount.toString(),
        timeLimit: timeLimit.toString()
      }
    });
  };

  const handleGoBack = () => {
    console.log('Going back to main menu');
    router.push('/');
  };

  return (
    <SafeAreaView style={commonStyles.wrapper}>
      <View style={commonStyles.container}>
        <View style={commonStyles.content}>
          <Text style={commonStyles.title}>Configuración</Text>
          
          <View style={[commonStyles.card, { marginTop: verticalScale(30), marginBottom: verticalScale(20) }]}>
            <Text style={[commonStyles.text, { marginBottom: verticalScale(15) }]}>
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

          <View style={[commonStyles.card, { marginBottom: verticalScale(40) }]}>
            <Text style={[commonStyles.text, { marginBottom: verticalScale(15) }]}>
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
              style={[buttonStyles.instructionsButton, { marginBottom: verticalScale(20) }]}
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