import { View, Text, StyleSheet, FlatList, Dimensions } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";


export function SettingsScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const data = [{ key: 'Devin' },
  { key: 'Dan' },
  { key: 'Dominic' },
  { key: 'Jackson' },
  { key: 'James' },
  { key: 'Joel' },
  { key: 'John' },
  { key: 'Dominic 1' },
  { key: 'Jackson 1' },
  { key: 'James 1' },
  { key: 'Joel 1' },
  { key: 'John 1' },
  { key: 'Jillian 1' },
  { key: 'Jimmy 1' },
  { key: 'Julie' },]

  const screenWidth = Dimensions.get('window').width;

  return (
    <SafeAreaView
      edges={['right', 'left', 'top']}
      style={[styles.container, { width: screenWidth }]}>
      <FlatList data={data}
        contentContainerStyle={{ paddingBottom: tabBarHeight }}
        renderItem={({ item }) =>
          <View style={[styles.itemContainer, { width: screenWidth }]}>
            <Text style={styles.item}>{item.key}</Text>
          </View>} />
      <StatusBar style='auto' />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    gap: 2,
    backgroundColor: "#fff",
    paddingTop: 10,
    alignItems: "center",
  },
  itemContainer: {
    borderWidth: 1,
    borderColor: 'red',
    padding: 10,
    margin: 5,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  }
});