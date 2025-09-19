import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
} from "react-native";
import DatePicker from "react-native-date-picker";
import { styles } from "./NotificationScreen.styles";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

export function NotificationScreen() {
  const [isEnabled, setIsEnabled] = useState(true);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [interval, setInterval] = useState(60);
  const [selectedDays, setSelectedDays] = useState([
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun",
  ]);
  const [notificationSound, setNotificationSound] = useState("gentle");
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const tabBarHeight = useBottomTabBarHeight();

  React.useEffect(() => {
    const start = new Date();
    start.setHours(8, 0, 0, 0);
    setStartTime(start);

    const end = new Date();
    end.setHours(22, 0, 0, 0);
    setEndTime(end);
  }, []);

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const interValOptions = [15, 30, 45, 60, 90, 120, 180];

  const soundOptions = [
    { value: "gentle", label: "Gentle Bell" },
    { value: "water-drop", label: "Water Drop" },
    { value: "chime", label: "Soft Chime" },
    { value: "bubble", label: "Bubble Pop" },
  ];

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const calculateReminders = () => {
    if (!startTime || !endTime || !interval) return 0;

    const diffMs = endTime.getTime() - startTime.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    if (diffHours <= 0) return 0;
    return Math.floor((diffHours * 60) / interval) + 1;
  };

  const getNextReminder = () => {
    const now = new Date();
    const today = now.toLocaleDateString("en-US", { weekday: "short" });

    if (!selectedDays.includes(today)) {
      return `Tomorrow at ${formatTime(startTime)}`;
    }

    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const startHour = startTime.getHours();
    const startMinute = startTime.getMinutes();
    const endHour = endTime.getHours();
    const endMinute = endTime.getMinutes();

    if (
      currentHour < startHour ||
      (currentHour === startHour && currentMinute < startMinute)
    ) {
      return `Today at ${formatTime(startTime)}`;
    } else if (
      currentHour < endHour ||
      (currentHour === endHour && currentMinute < endMinute)
    ) {
      const nextInterval = new Date(now.getTime() + interval * 60000);
      return `Next: ${formatTime(nextInterval)}`;
    } else {
      return `Tomorrow at ${formatTime(startTime)}`;
    }
  };

  const handleSave = () => {
    Alert.alert(
      "Settings Saved",
      "Your water reminder settings have been saved successfully!",
      [{ text: "OK" }]
    );
  };

  return (
    <>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: tabBarHeight }}
      >
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerIcon}>
              <Text style={styles.headerIconText}>🔔</Text>
            </View>
            <View>
              <Text style={styles.headerTitle}>Water Reminders</Text>
              <Text style={styles.headerSubTitle}>
                Stay hydrated with personalized notifications
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.content}>
          <View style={styles.card}>
            <View style={styles.cardRow}>
              <View style={styles.cardLeft}>
                <Text style={styles.cardIcon}>💧</Text>
                <View>
                  <Text style={styles.cardTitle}>Enable Reminders</Text>
                  <Text style={styles.cardSubTitle}>
                    Get notified to drink water
                  </Text>
                </View>
              </View>
              <Switch
                value={isEnabled}
                onValueChange={setIsEnabled}
                trackColor={{ false: "#E5E7EB", true: "#93C5FD" }}
                thumbColor={isEnabled ? "#3B82F6" : "#F3F4F6"}
              />
            </View>
          </View>
          {/* Time settings */}
          <View style={[styles.card, !isEnabled && styles.disabledCard]}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>🕐</Text>
              <Text style={styles.cardTitle}>Active Hours</Text>
            </View>
            <View style={styles.timeRow}>
              <View style={styles.timeSection}>
                <Text style={styles.timeLabel}>Start Time</Text>
                <TouchableOpacity
                  style={styles.timeButton}
                  onPress={() => setShowStartPicker(true)}
                  disabled={!isEnabled}
                >
                  <Text style={styles.timeButtonText}>
                    {formatTime(startTime)}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.timeSection}>
                <Text style={styles.timeLabel}>End Time</Text>
                <TouchableOpacity
                  style={styles.timeButton}
                  onPress={() => setShowEndPicker(true)}
                  disabled={!isEnabled}
                >
                  <Text style={styles.timeButtonText}>{formatTime(endTime)}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {/* Interval settings */}
          <View style={[styles.card, !isEnabled && styles.disabledCard]}>
            <Text style={styles.cardTitle}>Reminder Interval</Text>
            <View style={styles.intervalGrid}>
              {interValOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.intervalButton,
                    interval === option && styles.intervalButtonActive,
                  ]}
                  onPress={() => setInterval(option)}
                  disabled={!isEnabled}
                >
                  <Text
                    style={[
                      styles.intervalButtonText,
                      interval === option && styles.intervalButtonTextActive,
                    ]}
                  >
                    {option}m
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.intervalInfor}>
              ≈ {calculateReminders()} reminders per day
            </Text>
          </View>
          {/* Days Selection */}
          <View style={[styles.card, !isEnabled && styles.disabledCard]}>
            <Text style={styles.cardTitle}>Active Days</Text>
            <View style={styles.daysRow}>
              {days.map((day) => (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.dayButton,
                    selectedDays.includes(day) && styles.dayButtonActive,
                  ]}
                  onPress={() => toggleDay(day)}
                  disabled={!isEnabled}
                >
                  <Text
                    style={[
                      styles.dayButtonText,
                      selectedDays.includes(day) && styles.dayButtonTextActive,
                    ]}
                  >
                    {day}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          {/* Notification Sound */}
          <View style={[styles.card, !isEnabled && styles.disabledCard]}>
            <Text style={styles.cardTitle}>Notification Sound</Text>
            <View style={styles.soundSection}>
              {soundOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => setNotificationSound(option.value)}
                  disabled={!isEnabled}
                  style={[
                    styles.soundOption,
                    notificationSound === option.value &&
                    styles.soundOptionActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.soundOptionText,
                      notificationSound === option.value &&
                      styles.soundOptionTextActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity>
              <Text>▶ Test Sound</Text>
            </TouchableOpacity>
          </View>
          {/* Status */}
          {isEnabled && (
            <View style={styles.statusCard}>
              <Text style={styles.statusTitle}>Status</Text>
              <View style={styles.statusRow}>
                <View style={styles.statusIndicator} />
                <Text style={styles.statusText}>{getNextReminder()}</Text>
              </View>
            </View>
          )}
          {/* Save Button */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>💾 Save Settings</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <DatePicker
        modal
        mode="time"
        open={showStartPicker}
        date={startTime}
        onConfirm={(date) => {
          setShowStartPicker(false);
          setStartTime(date);
        }}
        onCancel={() => {
          setShowStartPicker(false);
        }}
      />
      <DatePicker
        modal
        mode="time"
        open={showEndPicker}
        date={endTime}
        onConfirm={(date) => {
          setShowEndPicker(false);
          setEndTime(date);
        }}
        onCancel={() => {
          setShowEndPicker(false);
        }}
      />
    </>
  );
}
