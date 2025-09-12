
import { Text, View, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import Button from '../components/Button';
import { commonStyles, buttonStyles, scale, verticalScale, moderateScale } from '../styles/commonStyles';
import NumberSelector from '../components/NumberSelector';

export default function SetupScreen() {
  const [questionCount, setQuestionCount] = useState(10);

  const goToDifficulty = () => {
    console.log('Going to difficulty selection with:', { questionCount });
    router.push({
      pathname: '/difficulty',
      params: {
        questionCount: questionCount.toString()
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
          
          <View style={[commonStyles.card, { marginTop: verticalScale(30), marginBottom: verticalScale(40) }]}>
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

          <View style={commonStyles.buttonContainer}>
            <Button
              text="Continuar"
              onPress={goToDifficulty}
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
