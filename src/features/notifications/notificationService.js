import apiClient from '../../lib/apiClient';

export const notificationService = {
  subscribePush: async (subscription) => {
    const res = await apiClient.post('/notifications/subscribe', subscription);
    return res.data;
  }
};