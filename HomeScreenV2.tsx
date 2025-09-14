import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Platform,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WaterEntry from './WaterEntry';

const WaterTrackerHome = () => {
  const [currentIntake, setCurrentIntake] = useState(0); // ml
  const [dailyGoal, setDailyGoal] = useState(2000); // ml
  const [todaysEntries, setTodaysEntries] = useState<WaterEntry[]>([]);

  // Animation references
  const waterLevelAnimation = useRef(new Animated.Value(0)).current;
  const pulseAnimation = useRef(new Animated.Value(1)).current;
  const dropAnimation = useRef(new Animated.Value(-50)).current;
  const waveAnimation1 = useRef(new Animated.Value(0)).current;
  const waveAnimation2 = useRef(new Animated.Value(0)).current;
  const scaleAnimation = useRef(new Animated.Value(1)).current;

  // Quick add amounts
  const quickAmounts = [100, 150, 200, 250, 300, 500];

  // Calculate percentage
  const percentage = Math.min((currentIntake / dailyGoal) * 100, 100);

  useEffect(() => {
    loadDailyGoal();
    loadCurrentIntake();
    loadTodaysEntries();
  }, []);

  useEffect(() => {
    // Animate water level to current percentage
    Animated.spring(waterLevelAnimation, {
      toValue: percentage,
      useNativeDriver: false,
      tension: 50,
      friction: 8,
      delay: 300,
    }).start();

    // Continuous wave animations
    const createWaveAnimation = (animatedValue: Animated.Value, duration: number, delay = 0) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: duration,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: duration,
            useNativeDriver: true,
          }),
        ])
      );
    };

    createWaveAnimation(waveAnimation1, 2000).start();
    createWaveAnimation(waveAnimation2, 2500, 500).start();

  }, [currentIntake, dailyGoal, percentage]);

  const saveDailyGoal = async (goal: number) => {
    try {
      await AsyncStorage.setItem('dailyGoal', JSON.stringify(goal));
    } catch {
      Alert.alert('Error', 'Failed to save daily goal.');
    }
  };

  const loadDailyGoal = async () => {
    try {
      const value = await AsyncStorage.getItem('dailyGoal');
      if (value !== null) {
        setDailyGoal(JSON.parse(value));
      }
    } catch {
      Alert.alert('Error', 'Failed to load daily goal.');
    }
  };

  const updateDailyGoal = (newGoal: number) => {
    setDailyGoal(newGoal);
    saveDailyGoal(newGoal);
  };

  const saveCurrentIntake = async (intake: number) => {
    try {
      await AsyncStorage.setItem('currentIntake', JSON.stringify(intake));
    } catch {
      Alert.alert('Error', 'Failed to save current intake.');
    }
  };

  const loadCurrentIntake = async () => {
    try {
      const value = await AsyncStorage.getItem('currentIntake');
      if (value !== null) {
        setCurrentIntake(JSON.parse(value));
      }
    } catch {
      Alert.alert('Error', 'Failed to load current intake.');
    }
  };

  const saveTodaysEntries = async (entries: WaterEntry[]) => {
    try {
      await AsyncStorage.setItem('todaysEntries', JSON.stringify(entries));
    } catch {
      Alert.alert('Error', 'Failed to save todays entries.');
    }
  };

  const loadTodaysEntries = async () => {
    try {
      const value = await AsyncStorage.getItem('todaysEntries');
      if (value !== null) {
        setTodaysEntries(JSON.parse(value));
      }
    } catch {
      Alert.alert('Error', 'Failed to load todays entries.');
    }
  };

  const animateWaterDrop = () => {
    // Reset animations
    dropAnimation.setValue(-50);
    pulseAnimation.setValue(1);
    scaleAnimation.setValue(1);

    // Drop animation
    Animated.timing(dropAnimation, {
      toValue: 50,
      duration: 600,
      useNativeDriver: true,
    }).start(() => {
      // Reset drop position
      dropAnimation.setValue(-50);
    });

    // Pulse effect on main tracker
    Animated.sequence([
      Animated.timing(pulseAnimation, {
        toValue: 1.05,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnimation, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    // Scale effect on center content
    Animated.sequence([
      Animated.timing(scaleAnimation, {
        toValue: 1.1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const addWater = (amount: number) => {
    const newIntake = currentIntake + amount;
    setCurrentIntake(newIntake);
    saveCurrentIntake(newIntake);

    const currentTime = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });

    const newEntry = {
      time: currentTime,
      amount: amount,
      type: 'water'
    };

    const newEntries = [newEntry, ...todaysEntries];
    setTodaysEntries(newEntries);
    saveTodaysEntries(newEntries);
    animateWaterDrop();

    // Congratulations when goal is reached
    if (currentIntake < dailyGoal && newIntake >= dailyGoal) {
      setTimeout(() => {
        Alert.alert(
          '🎉 Congratulations!',
          'You\'ve reached your daily hydration goal!',
          [{ text: 'Awesome!', style: 'default' }]
        );
      }, 500);
    }
  };

  const handleUpdateGoal = () => {
    Alert.prompt(
      'Update Daily Goal',
      'Enter your new daily goal in milliliters:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Update',
          onPress: (goal) => {
            const numGoal = parseInt(goal ?? '');
            if (!isNaN(numGoal) && numGoal > 0) {
              updateDailyGoal(numGoal);
            }
          }
        }
      ],
      'plain-text',
      dailyGoal.toString(),
      'numeric'
    );
  };

  const handleCustomAmount = () => {
    Alert.prompt(
      'Add Custom Amount',
      'Enter the amount of water in milliliters:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Add',
          onPress: (amount) => {
            const numAmount = parseInt(amount ?? '');
            if (!isNaN(numAmount) && numAmount > 0) {
              addWater(numAmount);
            }
          }
        }
      ],
      'plain-text',
      '',
      'numeric'
    );
  };

  const formatTime = () => {
    const now = new Date();
    return now.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  const getMotivationalMessage = () => {
    if (percentage >= 100) return "🎉 Goal achieved! You're well hydrated!";
    if (percentage >= 75) return "💪 Almost there! Keep it up!";
    if (percentage >= 50) return "👍 Great progress! You're halfway there!";
    if (percentage >= 25) return "🌟 Good start! Keep drinking!";
    return "💧 Let's start hydrating! Your body will thank you!";
  };

  const getRemainingWater = () => {
    const remaining = Math.max(dailyGoal - currentIntake, 0);
    return remaining;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>Good day! 👋</Text>
            <Text style={styles.date}>{formatTime()}</Text>
          </View>
          <TouchableOpacity style={styles.settingsButton} activeOpacity={0.7} onPress={handleUpdateGoal}>
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Main Water Tracker */}
        <View style={styles.trackerContainer}>
          <Animated.View style={[styles.trackerCard, { transform: [{ scale: pulseAnimation }] }]}>
            {/* Water Drop Animation */}
            <Animated.View
              style={[
                styles.waterDrop,
                {
                  transform: [{ translateY: dropAnimation }],
                  opacity: dropAnimation.interpolate({
                    inputRange: [-50, 0, 50],
                    outputRange: [0, 1, 0],
                    extrapolate: 'clamp',
                  })
                }
              ]}
            >
              <Text style={styles.dropIcon}>💧</Text>
            </Animated.View>

            {/* Circular Water Tracker */}
            <View style={styles.circularTracker}>
              <View style={styles.outerCircle}>
                {/* Animated Water Level */}
                <Animated.View
                  style={[
                    styles.waterLevel,
                    {
                      height: waterLevelAnimation.interpolate({
                        inputRange: [0, 100],
                        outputRange: ['0%', '100%'],
                        extrapolate: 'clamp',
                      }),
                    }
                  ]}
                >
                  {/* Wave Animations */}
                  <Animated.View
                    style={[
                      styles.wave1,
                      {
                        transform: [{
                          translateX: waveAnimation1.interpolate({
                            inputRange: [0, 1],
                            outputRange: [-30, 30],
                          })
                        }]
                      }
                    ]}
                  />
                  <Animated.View
                    style={[
                      styles.wave2,
                      {
                        transform: [{
                          translateX: waveAnimation2.interpolate({
                            inputRange: [0, 1],
                            outputRange: [30, -30],
                          })
                        }]
                      }
                    ]}
                  />
                </Animated.View>

                {/* Center Content */}
                <Animated.View style={[styles.centerContent, { transform: [{ scale: scaleAnimation }] }]}>
                  <Text style={styles.currentAmount}>{currentIntake}</Text>
                  <Text style={styles.unit}>ml</Text>
                  <View style={styles.goalContainer}>
                    <Text style={styles.goalText}>of {dailyGoal}ml</Text>
                    <Text style={styles.percentage}>{Math.round(percentage)}%</Text>
                  </View>
                </Animated.View>
              </View>
            </View>

            {/* Motivational Message */}
            <Text style={styles.motivationalText}>
              {getMotivationalMessage()}
            </Text>

            {/* Remaining Water */}
            {getRemainingWater() > 0 && (
              <Text style={styles.remainingText}>
                {getRemainingWater()}ml remaining to reach your goal
              </Text>
            )}
          </Animated.View>
        </View>

        {/* Quick Add Buttons */}
        <View style={styles.quickAddContainer}>
          <Text style={styles.sectionTitle}>Quick Add</Text>
          <View style={styles.quickAddGrid}>
            {quickAmounts.map((amount) => (
              <TouchableOpacity
                key={amount}
                style={styles.quickAddButton}
                onPress={() => addWater(amount)}
                activeOpacity={0.8}
              >
                <Text style={styles.quickAddIcon}>💧</Text>
                <Text style={styles.quickAddAmount}>{amount}ml</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Today's Progress */}
        <View style={styles.progressContainer}>
          <Text style={styles.sectionTitle}>Today's Progress</Text>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>📈</Text>
              <Text style={styles.statValue}>{todaysEntries.length}</Text>
              <Text style={styles.statLabel}>Drinks</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>⏰</Text>
              <Text style={styles.statValue}>
                {todaysEntries.length > 0 ? todaysEntries[0].time : '--:--'}
              </Text>
              <Text style={styles.statLabel}>Last Drink</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>🎯</Text>
              <Text style={styles.statValue}>{Math.round(percentage)}%</Text>
              <Text style={styles.statLabel}>Goal</Text>
            </View>
          </View>
        </View>

        {/* Recent Entries */}
        <View style={styles.entriesContainer}>
          <Text style={styles.sectionTitle}>Recent Entries</Text>
          {todaysEntries.slice(0, 5).map((entry, index) => (
            <View key={index} style={styles.entryItem}>
              <View style={styles.entryLeft}>
                <View style={styles.entryIconContainer}>
                  <Text style={styles.entryIcon}>
                    {entry.type === 'water' ? '💧' : '🍵'}
                  </Text>
                </View>
                <View>
                  <Text style={styles.entryAmount}>{entry.amount}ml</Text>
                  <Text style={styles.entryTime}>{entry.time}</Text>
                </View>
              </View>
              <Text style={styles.entryType}>
                {entry.type === 'water' ? 'Water' : 'Tea'}
              </Text>
            </View>
          ))}
        </View>

        {/* Custom Add Button */}
        <TouchableOpacity
          style={styles.customAddButton}
          onPress={handleCustomAmount}
          activeOpacity={0.8}
        >
          <Text style={styles.customAddIcon}>➕</Text>
          <Text style={styles.customAddText}>Add Custom Amount</Text>
        </TouchableOpacity>

        {/* Achievement Badge */}
        {percentage >= 100 && (
          <Animated.View style={styles.achievementBadge}>
            <Text style={styles.achievementIcon}>🏆</Text>
            <Text style={styles.achievementTitle}>Daily Goal Achieved!</Text>
            <Text style={styles.achievementSubtitle}>Excellent hydration today!</Text>
          </Animated.View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F9FF',
  },
  header: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#BFDBFE',
  },
  settingsButton: {
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
  },
  settingsIcon: {
    fontSize: 20,
  },
  content: {
    flex: 1,
  },
  trackerContainer: {
    padding: 24,
    paddingTop: 32,
  },
  trackerCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
    position: 'relative',
    overflow: 'visible',
  },
  waterDrop: {
    position: 'absolute',
    top: -25,
    zIndex: 10,
  },
  dropIcon: {
    fontSize: 28,
  },
  circularTracker: {
    alignItems: 'center',
    marginBottom: 24,
  },
  outerCircle: {
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: '#F8FAFC',
    borderWidth: 6,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  waterLevel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#3B82F6',
    overflow: 'hidden',
  },
  wave1: {
    position: 'absolute',
    top: -8,
    left: -30,
    right: -30,
    height: 16,
    backgroundColor: '#60A5FA',
    borderRadius: 8,
    opacity: 0.7,
  },
  wave2: {
    position: 'absolute',
    top: -4,
    left: -25,
    right: -25,
    height: 12,
    backgroundColor: '#93C5FD',
    borderRadius: 6,
    opacity: 0.5,
  },
  centerContent: {
    alignItems: 'center',
    zIndex: 2,
    backgroundColor: 'transparent',
  },
  currentAmount: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  unit: {
    fontSize: 18,
    color: '#64748B',
    marginTop: -4,
  },
  goalContainer: {
    alignItems: 'center',
    marginTop: 12,
  },
  goalText: {
    fontSize: 14,
    color: '#64748B',
  },
  percentage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginTop: 4,
  },
  motivationalText: {
    fontSize: 17,
    color: '#3B82F6',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 8,
    lineHeight: 24,
  },
  remainingText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
  quickAddContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  quickAddGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickAddButton: {
    width: '30%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 2,
    borderColor: '#E0F2FE',
  },
  quickAddIcon: {
    fontSize: 28,
    marginBottom: 6,
  },
  quickAddAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3B82F6',
  },
  progressContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  entriesContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  entryItem: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  entryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  entryIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#EBF4FF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  entryIcon: {
    fontSize: 18,
  },
  entryAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  entryTime: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  entryType: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '600',
  },
  customAddButton: {
    marginHorizontal: 24,
    backgroundColor: '#3B82F6',
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 24,
  },
  customAddIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  customAddText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
  achievementBadge: {
    marginHorizontal: 24,
    backgroundColor: '#10B981',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 24,
  },
  achievementIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  achievementTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  achievementSubtitle: {
    fontSize: 14,
    color: '#A7F3D0',
  },
  bottomSpacer: {
    height: 24,
  },
});

export default WaterTrackerHome;