import { Text, View, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import Button from '../components/Button';
import { commonStyles, buttonStyles } from '../styles/commonStyles';

export default function MainScreen() {
  return (
    <SafeAreaView style={commonStyles.wrapper}>
      <View style={commonStyles.container}>
        <View style={commonStyles.content}>
          <Text style={commonStyles.title}>Tablas de Multiplicar</Text>
          <Text style={commonStyles.text}>Practica las tablas de multiplicar del 1 al 12</Text>
          
          <View style={[commonStyles.buttonContainer, { marginTop: 40 }]}>
            <Button
              text="Comenzar Práctica"
              onPress={() => router.push('/setup')}
              style={[buttonStyles.instructionsButton, { marginBottom: 20 }]}
            />
            
            <Button
              text="Estadísticas"
              onPress={() => router.push('/statistics')}
              style={buttonStyles.backButton}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}