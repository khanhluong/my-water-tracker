import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { HomeScreen } from "./HomeScreen";
import { NotificationScreen } from "./NotificationScreen"
import * as Notifications from 'expo-notifications';
import { SettingsScreen } from "./SettingsScreen";
import { SettingsScreenV2 } from "./SettingsScreenV2";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const Tab = createBottomTabNavigator();

export default function App() {
  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('You need to enable notifications to get reminders!');
      }
    };

    requestPermissions();

    // Optional: If you want to do something when a user taps the notification
    // const subscription = Notifications.addNotificationResponseReceivedListener(response => {});
    // return () => subscription.remove();
  }, []);
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false, // Optional: hides the header for a cleaner look
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap = "home";
            if (route.name === "Home") {
              iconName = "home";
            } else if (route.name === "Settings") {
              iconName = focused ? "settings" : "settings-outline";
            } else if (route.name === "Notification") {
              iconName = focused ? "notifications-circle" : "notifications-circle-outline";
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarStyle: {
            position: 'absolute',
            backgroundColor: 'transparent',
            borderTopWidth: 0, // Removes the top border
            elevation: 0, // Removes the shadow on Android
          },
        })}
      >
        <Tab.Screen name='Home' component={HomeScreen} />
        <Tab.Screen name='Notification' component={NotificationScreen} />
        <Tab.Screen name='Settings' component={SettingsScreenV2} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
