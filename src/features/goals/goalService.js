import apiClient from '../../lib/apiClient';

export const goalService = {
  getGoals: async () => {
    const res = await apiClient.get('/goals');
    return res.data;
  },
  createGoal: async (data) => {
    const res = await apiClient.post('/goals', data);
    return res.data;
  }
};