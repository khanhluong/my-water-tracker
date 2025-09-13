import { StyleSheet, Text, TouchableOpacity, View, Dimensions } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Canvas, Path } from "@shopify/react-native-skia";
import React, { useState } from 'react';
interface CustomButtonProps {
  title: string;
  onPress: () => void;
};

const CustomButton = ({ title, onPress }: CustomButtonProps) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

export function HomeScreen() {
  const [size, setSize] = useState(20);
  const [waveHeight, setWaveHeight] = useState<number>(0);
  const width = Math.max(0, Math.round(Dimensions.get('window').width));
  const handleAddDrink = async () => {
    setSize(prevSize => prevSize + 20);
    setWaveHeight(prev => prev + 100);

    // await Notifications.scheduleNotificationAsync({
    //   content: {
    //     title: "💧 Drink Logged!",
    //     body: "Great job staying hydrated. Keep it up!",
    //   },
    //   trigger: null, // null means send the notification immediately
    // });
  }

  const reset = async () => {
    setSize(0)
    setWaveHeight(0)
  }

  // Reusable function to generate a sine wave path
  const getWavePath = (amplitude: number) => {
    const height = 100; // Canvas height for wave calculation
    const frequency = (2 * Math.PI) / width * 2; // 2 cycles across the width
    const phase = size / 10; // Animate wave by shifting its phase

    let path = `M 0 ${height / 2}`;
    for (let x = 0; x <= width; x += 2) {
      const y = height / 2 + amplitude * Math.sin(frequency * x + phase);
      path += ` L ${x} ${y}`;
    }
    return path;
  };

  return (
    <View style={styles.container}>
      <Canvas style={[styles.wave, { height: waveHeight }]}>
        <Path
          path={`${getWavePath(20)} L ${width} 0 L 0 0 Z`}
          color="#fff"
          style="fill"
        />
        <Path
          path={getWavePath(20)}
          color="deepskyblue"
          style="stroke"
          strokeWidth={2}
        />
        <Path
          path={getWavePath(25)}
          color="deepskyblue"
          style="stroke"
          strokeWidth={2}
        />
        <Path
          path={getWavePath(30)}
          color="deepskyblue"
          style="stroke"
          strokeWidth={2}
        />
      </Canvas>
      <View style={styles.buttonWrapper}>
        <CustomButton title="Add Drink" onPress={handleAddDrink} />
        <CustomButton title="Reset" onPress={reset} />
      </View>
      {/* <CustomButton title="Reset" onPress={reset} /> */}
      <StatusBar style='auto'></StatusBar>
    </View>
  )
}


const styles = StyleSheet.create({
  wave: {
    width: '100%',
    height: '50%',
    backgroundColor: "#e0f7fa"
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  buttonWrapper: {
    position: 'absolute',
    display: 'flex',
    alignSelf: 'center',
    flexDirection: 'row',
    gap: '10',
    top: '50%',
    transform: [{ translateY: -30 }],
    zIndex: 1,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  }
})