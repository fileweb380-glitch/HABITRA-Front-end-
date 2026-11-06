import { useState } from 'react';
import { notificationService } from '../notifications/notificationService';

export const useNotification = () => {
  const [permission, setPermission] = useState(Notification.permission);

  const requestPermission = async () => {
    if ('Notification' in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result;
    }
    return 'unsupported';
  };

  return { permission, requestPermission };
};