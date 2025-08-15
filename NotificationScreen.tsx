import { useState } from "react";
import { View, StyleSheet, Text, ScrollView, Platform, Switch } from "react-native";

export function NotificationScreen() {

  const [isEnabled, setIsEnabled] = useState(true);

  return (
    // Header
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerIcon}>
            <Text style={styles.headerIconText}>🔔</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>Water Reminders</Text>
            <Text style={styles.headerSubTitle}>Stay hydrated with personalized notifications</Text>
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
                <Text style={styles.cardSubTitle}>Get notified to drink water</Text>
              </View>
            </View>
            <Switch
              value={isEnabled}
              onValueChange={setIsEnabled}
              trackColor={{ false: '#E5E7EB', true: '#93C5FD' }}
              thumbColor={isEnabled ? '#3B82F6' : '#F3F4F6'}
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
            </View>
            <View style={styles.timeSection}>
              <Text style={styles.timeLabel}>End Time</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F9FF",
  },
  header: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 32
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  headerIcon: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerIconText: {
    fontSize: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white'
  },
  headerSubTitle: {
    fontSize: 14,
    color: '#BFDBFE'
  },
  content: {
    padding: 24,
    paddingTop: 24,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.1,
    shadowRadius: 0.84,
    elevation: 5
  },
  disabledCard: {
    opacity: 0.5
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  cardIcon: {
    fontSize: 20,
    marginRight: 12
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  cardSubTitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  timeRow: {},
  timeSection: {},
  timeLabel: {},
  timeButton: {},
  timeButtonText: {}
});