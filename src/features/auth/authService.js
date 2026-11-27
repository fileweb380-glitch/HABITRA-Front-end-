

import apiClient from '../../lib/apiClient';

export const authService = {

  // REGISTER
  register: async (name, email, password, timezone) => {
    const res = await apiClient.post('/auth/register', {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      timezone
    });

    return res.data;
  },

  // LOGIN
  login: async (email, password) => {
    const res = await apiClient.post('/auth/login', {
      email: email.trim().toLowerCase(),
      password
    });

    return res.data;
  },

  // GET CURRENT USER
  getMe: async () => {
    const res = await apiClient.get('/auth/me');
    return res.data;
  },

  // FORGOT PASSWORD
  forgotPassword: async (email) => {
    const res = await apiClient.post(
      '/auth/forgot-password',
      {
        email: email.trim().toLowerCase()
      }
    );

    return res.data;
  },

  // RESET PASSWORD
  resetPassword: async (token, password) => {
    const res = await apiClient.post(
      '/auth/reset-password',
      {
        token,
        password
      }
    );

    return res.data;
  }

};
