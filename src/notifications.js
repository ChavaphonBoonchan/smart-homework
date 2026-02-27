import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function requestNotificationPermissions() {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    console.log('Current notification permission status:', existingStatus);

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
      console.log('New notification permission status:', status);
    }

    if (finalStatus !== 'granted') {
      console.warn('Notification permission not granted');
      return false;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('homework', {
        name: 'Homework Reminders',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#3B82F6',
        sound: 'default',
        enableLights: true,
        enableVibrate: true,
      });
      console.log('Android notification channel created');
    }

    console.log('Notification permissions granted successfully');
    return true;
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
}

export async function scheduleReminder(homeworkId, subject, dueDate) {
  const dueDateObj = new Date(dueDate);
  const reminderDate = new Date(dueDateObj.getTime() - 24 * 60 * 60 * 1000);

  if (reminderDate <= new Date()) {
    console.log('Reminder date is in the past, skipping notification');
    return null;
  }

  try {
    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: '📚 Smart Homework Reminder',
        body: `วิชา "${subject}" ต้องส่งภายในพรุ่งนี้!`,
        data: { homeworkId },
        ...(Platform.OS === 'android' && { channelId: 'homework' }),
      },
      trigger: {
        type: 'date',
        date: reminderDate,
        channelId: 'homework',
      },
    });

    console.log('Notification scheduled:', identifier, 'for', reminderDate.toLocaleString('th-TH'));
    return identifier;
  } catch (error) {
    console.error('Failed to schedule notification:', error);
    return null;
  }
}

export async function cancelReminder(identifier) {
  if (identifier) {
    await Notifications.cancelScheduledNotificationAsync(identifier);
  }
}
