import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  Alert,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WaterEntry from '../models/WaterEntry';
import { waterIntakeRepository } from '../repositories/waterIntakeRepository';
import { styles } from './HomeScreenV2.stytes';

const WaterTrackerHome = () => {
  const [currentIntake, setCurrentIntake] = useState(0); // ml
  const [dailyGoal, setDailyGoal] = useState(2000); // ml
  const [todaysEntries, setTodaysEntries] = useState<WaterEntry[]>([]);
  const [isCustomAmountModalVisible, setIsCustomAmountModalVisible] =
    useState(false);
  const [customAmount, setCustomAmount] = useState('');

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
    waterIntakeRepository.setupDatabase();
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
    const createWaveAnimation = (
      animatedValue: Animated.Value,
      duration: number,
      delay = 0
    ) => {
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
      minute: '2-digit',
    });

    const newEntry = {
      time: currentTime,
      amount: amount,
      type: 'water',
    };

    waterIntakeRepository.addWaterEntry(amount, 'water');

    const newEntries = [newEntry, ...todaysEntries];
    setTodaysEntries(newEntries);
    saveTodaysEntries(newEntries);
    animateWaterDrop();

    // Congratulations when goal is reached
    if (currentIntake < dailyGoal && newIntake >= dailyGoal) {
      setTimeout(() => {
        Alert.alert(
          '🎉 Congratulations!',
          "You've reached your daily hydration goal!",
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
          },
        },
      ],
      'plain-text',
      dailyGoal.toString(),
      'numeric'
    );
  };

  const handleCustomAmount = () => {
    setIsCustomAmountModalVisible(true);
  };

  const handleAddCustomAmount = () => {
    const numAmount = parseInt(customAmount);
    if (!isNaN(numAmount) && numAmount > 0) {
      addWater(numAmount);
    }
    setCustomAmount('');
    setIsCustomAmountModalVisible(false);
  };

  const formatTime = () => {
    const now = new Date();
    return now.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  const getMotivationalMessage = () => {
    if (percentage >= 100) return "🎉 Goal achieved! You're well hydrated!";
    if (percentage >= 75) return '💪 Almost there! Keep it up!';
    if (percentage >= 50) return "👍 Great progress! You're halfway there!";
    if (percentage >= 25) return '🌟 Good start! Keep drinking!';
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
          <TouchableOpacity
            style={styles.settingsButton}
            activeOpacity={0.7}
            onPress={handleUpdateGoal}
          >
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Main Water Tracker */}
        <View style={styles.trackerContainer}>
          <Animated.View
            style={[styles.trackerCard, { transform: [{ scale: pulseAnimation }] }]}
          >
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
                  }),
                },
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
                    },
                  ]}
                >
                  {/* Wave Animations */}
                  <Animated.View
                    style={[
                      styles.wave1,
                      {
                        transform: [
                          {
                            translateX: waveAnimation1.interpolate({
                              inputRange: [0, 1],
                              outputRange: [-30, 30],
                            }),
                          },
                        ],
                      },
                    ]}
                  />
                  <Animated.View
                    style={[
                      styles.wave2,
                      {
                        transform: [
                          {
                            translateX: waveAnimation2.interpolate({
                              inputRange: [0, 1],
                              outputRange: [30, -30],
                            }),
                          },
                        ],
                      },
                    ]}
                  />
                </Animated.View>

                {/* Center Content */}
                <Animated.View
                  style={[
                    styles.centerContent,
                    { transform: [{ scale: scaleAnimation }] },
                  ]}
                >
                  <Text style={styles.currentAmount}>{currentIntake}</Text>
                  <Text style={styles.unit}>ml</Text>
                  <View style={styles.goalContainer}>
                    <Text style={styles.goalText}>of {dailyGoal}ml</Text>
                    <Text style={styles.percentage}>
                      {Math.round(percentage)}%
                    </Text>
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
            <Text style={styles.achievementSubtitle}>
              Excellent hydration today!
            </Text>
          </Animated.View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Custom Amount Modal */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={isCustomAmountModalVisible}
        onRequestClose={() => setIsCustomAmountModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setIsCustomAmountModalVisible(false)}
        >
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add Custom Amount</Text>
              <Text style={styles.modalSubtitle}>
                Enter the amount of water in milliliters.
              </Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g., 350"
                keyboardType="numeric"
                value={customAmount}
                onChangeText={setCustomAmount}
                autoFocus
              />
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonCancel]}
                  onPress={() => {
                    setCustomAmount('');
                    setIsCustomAmountModalVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.modalButtonText,
                      styles.modalButtonTextCancel,
                    ]}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonAdd]}
                  onPress={handleAddCustomAmount}
                >
                  <Text style={styles.modalButtonText}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default WaterTrackerHome;