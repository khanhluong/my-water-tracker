import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Canvas, Path } from "@shopify/react-native-skia";
import { useState } from "react";

export function HomeScreen() {
  const [size, setSize] = useState(20);
  const handleAddDrink = () => {
    setSize(prevSize => prevSize + 20);
  }

  // Generate a sine wave path
  const getWavePath = () => {
    const width = 400;
    const height = 100;
    const amplitude = 30;
    const frequency = 2 * Math.PI / width * 2; // 2 cycles
    const phase = size / 10; // animate with size

    let path = `M 0 ${height / 2}`;
    for (let x = 0; x <= width; x += 2) {
      const y = height / 2 + amplitude * Math.sin(frequency * x + phase);
      path += ` L ${x} ${y}`;
    }
    return path;
  };

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

  return (
    <View style={styles.container}>
      <Canvas style={styles.wave}>
        <Path
          path={`${getWavePath()} L 400 0 L 0 0 Z`}
          color="#fff"
          style="fill"
        />
        <Path
          path={getWavePath()}
          color="deepskyblue"
          style="stroke"
          strokeWidth={2}
        />
      </Canvas>
      <View style={styles.buttonWrapper}>
        <CustomButton title="Add Drink" onPress={handleAddDrink} />
      </View>
      {/* <CustomButton title="Reset" onPress={reset} /> */}
      <StatusBar style='auto'></StatusBar>
    </View>
  )
}



const styles = StyleSheet.create({
  wave: {
    width: '100%',
    height: '100%',
    backgroundColor: "#e0f7fa"
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonWrapper: {
    position: 'absolute',
    alignSelf: 'center',
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