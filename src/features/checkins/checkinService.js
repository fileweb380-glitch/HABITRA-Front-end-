import apiClient from '../../lib/apiClient';

export const checkinService = {
  getCheckins: async () => {
    const res = await apiClient.get('/checkins');
    return res.data;
  }
};