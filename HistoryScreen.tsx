
import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { WaterIntakeHistory } from './WaterIntakeHistory';
import waterIntakeHistoryData from './waterIntakeHistoryData';

const HistoryScreen = () => {
  const renderItem = ({ item }: { item: WaterIntakeHistory }) => (
    <View style={styles.entryContainer}>
      <Text style={styles.date}>{item.date}</Text>
      <FlatList
        data={item.entries}
        renderItem={({ item: entry }) => (
          <View style={styles.entry}>
            <Text>{entry.type} - {entry.amount} ml</Text>
            <Text style={styles.time}>{entry.time}</Text>
          </View>
        )}
        keyExtractor={(entry, index) => index.toString()}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Water Intake History</Text>
      <FlatList
        data={waterIntakeHistoryData}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  entryContainer: {
    marginBottom: 20,
  },
  date: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  entry: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 5,
  },
  time: {
    color: '#888',
  },
});

export default HistoryScreen;
