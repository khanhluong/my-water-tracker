
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, StatusBar, TouchableOpacity, Dimensions } from 'react-native';
import { WaterIntakeHistory } from '../models/WaterIntakeHistory';
import waterIntakeHistoryData from '../models/waterIntakeHistoryData';
import { LineChart } from 'react-native-chart-kit';

const HistoryScreen = () => {
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'graph'

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
    labels: waterIntakeHistoryData.map(item => item.date.substring(5)).reverse(),
    datasets: [
      {
        data: waterIntakeHistoryData.map(item => item.entries.reduce((total, entry) => total + entry.amount, 0)).reverse()
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
          data={waterIntakeHistoryData}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <View style={styles.chartContainer}>
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
  }
});

export default HistoryScreen;
