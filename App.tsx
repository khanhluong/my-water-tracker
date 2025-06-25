import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { HomeScreen } from "./HomeScreen";
import { NotificationScreen } from "./NotificationScreen"

function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text>Settings Screen</Text>
      <StatusBar style='auto' />
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
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
        })}
      >
        <Tab.Screen name='Home' component={HomeScreen} />
        <Tab.Screen name='Notification' component={NotificationScreen} />
        <Tab.Screen name='Settings' component={SettingsScreen} />
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
