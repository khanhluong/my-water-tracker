import {
  requestPermissionsAsync,
  SchedulableTriggerInputTypes,
  scheduleNotificationAsync,
} from "expo-notifications";
import { useState } from "react";
import { Button, View } from "react-native";

export default function NotificationRemider() {
  // const currentDate = new Date();
  // const alarmTime = new Date(currentDate.getTime() + 10000);

  const [scheduling, setScheduling] = useState(false);

  async function requestPermissions() {
    await requestPermissionsAsync();
  }

  async function scheduleNotification() {
    if (scheduling) {
      return;
    }
    setScheduling(true);
    let now = new Date().getTime();
    const eightAM = new Date(Date.now()).setHours(8, 0, 0); // set the time to 8am
    for (; now < eightAM + 12 * 60 * 60 * 1000; now += 2 * 60 * 60 * 1000) {
      const alarmTime = new Date();
      await scheduleNotificationAsync({
        content: {
          title: `Reminder at ${now}`,
          body: "Don't forget!",
        },
        trigger: {
          type: SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: (alarmTime.getTime() - Date.now()) / 1000,
        },
      });
    }
    setScheduling(fail);
  }

  requestPermissions();
  scheduleNotification();
  return (
    <View>
      <Button
        title="Set Remiders"
        onPress={() => scheduleNotification()}
      ></Button>
    </View>
  );
}
