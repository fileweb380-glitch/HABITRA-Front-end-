import apiClient from '../../lib/apiClient';

export const authService = {
  login: async (email, password) => {
    const res = await apiClient.post('/auth/login', { email, password });
    return res.data;
  },
  register: async (name, email, password, timezone) => {
    const res = await apiClient.post('/auth/register', { name, email, password, timezone });
    return res.data;
  },
  getMe: async () => {
    const res = await apiClient.get('/auth/me');
    return res.data;
  }
};