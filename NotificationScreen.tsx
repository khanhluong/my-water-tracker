import { View, StyleSheet, Text } from "react-native";

export function NotificationScreen() {
  return (
    <View style={styles.container}>
      <Text>Sample</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});