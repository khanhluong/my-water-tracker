
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, StatusBar, TouchableOpacity, Dimensions } from 'react-native';
import { WaterIntakeHistory } from '../models/WaterIntakeHistory';
import { LineChart } from 'react-native-chart-kit';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';
import { waterIntakeRepository } from '../repositories/waterIntakeRepository';

const HistoryScreen = () => {
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'graph'
  const [history, setHistory] = useState<WaterIntakeHistory[]>([]);
  const tabBarHeight = useBottomTabBarHeight();

  useFocusEffect(
    React.useCallback(() => {
      const loadHistory = async () => {
        const historyData = await waterIntakeRepository.getHistory();
        setHistory(historyData);
      };
      loadHistory();
    }, [])
  );

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

  const chartData = {
    labels: history.length > 0 ? history.map(item => item.date.substring(5)).reverse() : [" "],
    datasets: [
      {
        data: history.length > 0 ? history.map(item => item.entries.reduce((total, entry) => total + entry.amount, 0)).reverse() : [0]
      }
    ]
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Water Intake History</Text>
        <TouchableOpacity style={styles.toggleButton} onPress={() => setViewMode(viewMode === 'list' ? 'graph' : 'list')}>
          <Text style={styles.toggleButtonText}>{viewMode === 'list' ? 'Show Graph' : 'Show List'}</Text>
        </TouchableOpacity>
      </View>

      {viewMode === 'list' ? (
        <FlatList
          data={history}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ paddingBottom: tabBarHeight }}
          ListEmptyComponent={<View style={styles.emptyContainer}><Text style={styles.emptyText}>No history yet. Add some water on the Home screen!</Text></View>}
        />
      ) : (
        <View style={[styles.chartContainer, { paddingBottom: tabBarHeight }]}>
        {history.length > 0 ? (
          <LineChart
            data={chartData}
            width={Dimensions.get('window').width - 20}
            height={220}
            yAxisLabel=""
            yAxisSuffix="ml"
            yAxisInterval={1}
            chartConfig={{
              backgroundColor: '#e26a00',
              backgroundGradientFrom: '#fb8c00',
              backgroundGradientTo: '#ffa726',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: '#ffa726'
              }
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16
            }}
          />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No data to display in graph.</Text>
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    paddingHorizontal: 10,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  toggleButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
  },
  toggleButtonText: {
    color: 'white',
    fontWeight: 'bold',
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
  chartContainer: {
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  }
});

export default HistoryScreen;
