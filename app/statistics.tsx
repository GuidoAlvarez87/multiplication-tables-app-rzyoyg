import { Text, View, SafeAreaView, ScrollView, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import Button from '../components/Button';
import { commonStyles, buttonStyles, scale, verticalScale, moderateScale, screenWidth } from '../styles/commonStyles';
import { StyleSheet } from 'react-native';
import { colors } from '../styles/commonStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LineChart } from 'react-native-chart-kit';

interface SessionData {
  date: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  totalTime: number;
  averageResponseTime: number;
}

export default function StatisticsScreen() {
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [weeklyUsage, setWeeklyUsage] = useState<{[key: string]: number}>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      const sessionsData = await AsyncStorage.getItem('sessions');
      const usageData = await AsyncStorage.getItem('weeklyUsage');
      
      if (sessionsData) {
        setSessions(JSON.parse(sessionsData));
      }
      
      if (usageData) {
        setWeeklyUsage(JSON.parse(usageData));
      }
    } catch (error) {
      console.log('Error loading statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearStatistics = async () => {
    try {
      await AsyncStorage.removeItem('sessions');
      await AsyncStorage.removeItem('weeklyUsage');
      setSessions([]);
      setWeeklyUsage({});
    } catch (error) {
      console.log('Error clearing statistics:', error);
    }
  };

  const getWeeklyUsageData = () => {
    const last7Days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      last7Days.push({
        date: dateString,
        usage: weeklyUsage[dateString] || 0
      });
    }
    
    return last7Days;
  };

  const getScoreChartData = () => {
    const last10Sessions = sessions.slice(-10);
    
    if (last10Sessions.length === 0) {
      return {
        labels: ['Sin datos'],
        datasets: [{
          data: [0],
          strokeWidth: 2,
        }]
      };
    }
    
    return {
      labels: last10Sessions.map((_, index) => `S${index + 1}`),
      datasets: [{
        data: last10Sessions.map(session => session.score),
        strokeWidth: 2,
      }]
    };
  };

  const getUsageChartData = () => {
    const weekData = getWeeklyUsageData();
    
    return {
      labels: weekData.map(day => {
        const date = new Date(day.date);
        return date.toLocaleDateString('es-ES', { weekday: 'short' });
      }),
      datasets: [{
        data: weekData.map(day => Math.round(day.usage / (1000 * 60))), // Convert to minutes
        strokeWidth: 2,
      }]
    };
  };

  const getTotalStats = () => {
    if (sessions.length === 0) return null;
    
    const totalSessions = sessions.length;
    const averageScore = Math.round(sessions.reduce((sum, s) => sum + s.score, 0) / totalSessions);
    const totalCorrect = sessions.reduce((sum, s) => sum + s.correctAnswers, 0);
    const totalQuestions = sessions.reduce((sum, s) => sum + s.totalQuestions, 0);
    const accuracy = Math.round((totalCorrect / totalQuestions) * 100);
    const totalTimeMinutes = Math.round(sessions.reduce((sum, s) => sum + s.totalTime, 0) / (1000 * 60));
    
    return {
      totalSessions,
      averageScore,
      accuracy,
      totalTimeMinutes
    };
  };

  if (loading) {
    return (
      <SafeAreaView style={commonStyles.wrapper}>
        <View style={commonStyles.container}>
          <Text style={commonStyles.text}>Cargando estadísticas...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const stats = getTotalStats();
  const chartWidth = Math.min(screenWidth - scale(40), 400);

  return (
    <SafeAreaView style={commonStyles.wrapper}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={commonStyles.container}>
          <View style={commonStyles.content}>
            <Text style={commonStyles.title}>Estadísticas</Text>
            
            {stats ? (
              <>
                <View style={styles.statsGrid}>
                  <View style={styles.statCard}>
                    <Text style={styles.statNumber}>{stats.totalSessions}</Text>
                    <Text style={styles.statLabel}>Sesiones</Text>
                  </View>
                  
                  <View style={styles.statCard}>
                    <Text style={styles.statNumber}>{stats.averageScore}</Text>
                    <Text style={styles.statLabel}>Puntaje Promedio</Text>
                  </View>
                  
                  <View style={styles.statCard}>
                    <Text style={styles.statNumber}>{stats.accuracy}%</Text>
                    <Text style={styles.statLabel}>Precisión</Text>
                  </View>
                  
                  <View style={styles.statCard}>
                    <Text style={styles.statNumber}>{stats.totalTimeMinutes}m</Text>
                    <Text style={styles.statLabel}>Tiempo Total</Text>
                  </View>
                </View>

                <View style={styles.chartContainer}>
                  <Text style={styles.chartTitle}>Puntajes de las Últimas 10 Sesiones</Text>
                  <LineChart
                    data={getScoreChartData()}
                    width={chartWidth}
                    height={verticalScale(200)}
                    chartConfig={{
                      backgroundColor: colors.backgroundAlt,
                      backgroundGradientFrom: colors.backgroundAlt,
                      backgroundGradientTo: colors.backgroundAlt,
                      decimalPlaces: 0,
                      color: (opacity = 1) => `rgba(100, 181, 246, ${opacity})`,
                      labelColor: (opacity = 1) => `rgba(227, 227, 227, ${opacity})`,
                      style: {
                        borderRadius: scale(16)
                      },
                      propsForDots: {
                        r: scale(4).toString(),
                        strokeWidth: "2",
                        stroke: colors.accent
                      }
                    }}
                    bezier
                    style={styles.chart}
                  />
                </View>

                <View style={styles.chartContainer}>
                  <Text style={styles.chartTitle}>Uso Semanal (minutos)</Text>
                  <LineChart
                    data={getUsageChartData()}
                    width={chartWidth}
                    height={verticalScale(200)}
                    chartConfig={{
                      backgroundColor: colors.backgroundAlt,
                      backgroundGradientFrom: colors.backgroundAlt,
                      backgroundGradientTo: colors.backgroundAlt,
                      decimalPlaces: 0,
                      color: (opacity = 1) => `rgba(100, 181, 246, ${opacity})`,
                      labelColor: (opacity = 1) => `rgba(227, 227, 227, ${opacity})`,
                      style: {
                        borderRadius: scale(16)
                      },
                      propsForDots: {
                        r: scale(4).toString(),
                        strokeWidth: "2",
                        stroke: colors.accent
                      }
                    }}
                    bezier
                    style={styles.chart}
                  />
                </View>
              </>
            ) : (
              <View style={styles.noDataContainer}>
                <Text style={styles.noDataText}>
                  No hay estadísticas disponibles.
                </Text>
                <Text style={styles.noDataSubtext}>
                  Completa algunas sesiones de práctica para ver tus estadísticas.
                </Text>
              </View>
            )}

            <View style={commonStyles.buttonContainer}>
              {stats && (
                <Button
                  text="Limpiar Estadísticas"
                  onPress={clearStatistics}
                  style={[buttonStyles.backButton, { marginBottom: verticalScale(20), backgroundColor: '#F44336' }]}
                />
              )}
              
              <Button
                text="Volver"
                onPress={() => router.back()}
                style={buttonStyles.backButton}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: verticalScale(20),
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: verticalScale(30),
    paddingHorizontal: scale(10),
  },
  statCard: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: scale(12),
    padding: scale(15),
    alignItems: 'center',
    width: '48%',
    marginBottom: verticalScale(15),
    borderWidth: 1,
    borderColor: colors.grey,
    minHeight: verticalScale(80),
    justifyContent: 'center',
  },
  statNumber: {
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
  chartContainer: {
    alignItems: 'center',
    marginBottom: verticalScale(30),
    paddingHorizontal: scale(10),
  },
  chartTitle: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: verticalScale(15),
    textAlign: 'center',
  },
  chart: {
    borderRadius: scale(16),
  },
  noDataContainer: {
    alignItems: 'center',
    paddingVertical: verticalScale(60),
    paddingHorizontal: scale(40),
  },
  noDataText: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: verticalScale(10),
  },
  noDataSubtext: {
    fontSize: moderateScale(14),
    color: colors.grey,
    textAlign: 'center',
    lineHeight: moderateScale(22),
  },
});