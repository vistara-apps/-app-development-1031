// Check if notification permission is granted
export const hasNotificationPermission = () => {
  if (!('Notification' in window)) {
    return false;
  }
  
  return Notification.permission === 'granted';
};

// Request notification permission
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }
  
  if (Notification.permission === 'granted') {
    return true;
  }
  
  if (Notification.permission === 'denied') {
    console.log('Notification permission denied');
    return false;
  }
  
  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
};

// Send notification
export const sendNotification = (title, options = {}) => {
  if (!hasNotificationPermission()) {
    console.log('Notification permission not granted');
    return;
  }
  
  try {
    const notification = new Notification(title, {
      icon: '/logo192.png',
      ...options
    });
    
    return notification;
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

// Schedule notification
export const scheduleNotification = (title, options = {}, delay) => {
  setTimeout(() => {
    sendNotification(title, options);
  }, delay);
};

