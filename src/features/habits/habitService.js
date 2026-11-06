import apiClient from '../../lib/apiClient';

export const habitService = {
  getHabits: async () => {
    const res = await apiClient.get('/habits');
    return res.data;
  },
  createHabit: async (data) => {
    const res = await apiClient.post('/habits', data);
    return res.data;
  },
  logEntry: async (habitId, data) => {
    const res = await apiClient.post(`/habits/${habitId}/entries`, data);
    return res.data;
  }
};