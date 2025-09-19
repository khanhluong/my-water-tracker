import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

export const saveSetting = async (key: string, value: unknown) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch {
    Alert.alert(`Failed to save ${key} setting.`);
  }
};

export const loadSetting = async (key: string) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch {
    Alert.alert(`Failed to load ${key} setting.`);
    return null;
  }
};
