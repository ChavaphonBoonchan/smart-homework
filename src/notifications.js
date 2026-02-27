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
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return false;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('homework', {
      name: 'Homework Reminders',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#3B82F6',
    });
  }

  return true;
}

export async function scheduleReminder(homeworkId, subject, dueDate) {
  const dueDateObj = new Date(dueDate);
  const reminderDate = new Date(dueDateObj.getTime() - 24 * 60 * 60 * 1000);

  if (reminderDate <= new Date()) {
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
      trigger: reminderDate,
    });

    console.log('Notification scheduled:', identifier, 'for', reminderDate);
    return identifier;
  } catch (error) {
    console.error('Failed to schedule notification:', error);
    return null;
  }
}

export async function scheduleTestNotification() {
  try {
    const testDate = new Date(Date.now() + 10 * 1000);
    
    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: '🔔 ทดสอบการแจ้งเตือน',
        body: 'ถ้าเห็นข้อความนี้แสดงว่าระบบแจ้งเตือนทำงานได้!',
        data: { test: true },
        ...(Platform.OS === 'android' && { channelId: 'homework' }),
      },
      trigger: testDate,
    });

    console.log('Test notification scheduled for 10 seconds from now');
    return identifier;
  } catch (error) {
    console.error('Failed to schedule test notification:', error);
    return null;
  }
}

export async function cancelReminder(identifier) {
  if (identifier) {
    await Notifications.cancelScheduledNotificationAsync(identifier);
  }
}
