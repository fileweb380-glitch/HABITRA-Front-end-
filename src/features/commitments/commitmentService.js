import apiClient from '../../lib/apiClient';

export const commitmentService = {
  getCommitments: async (date) => {
    const res = await apiClient.get(`/commitments${date ? `?date=${date}` : ''}`);
    return res.data;
  },
  createCommitment: async (data) => {
    const res = await apiClient.post('/commitments', data);
    return res.data;
  },
  updateStatus: async (id, statusData) => {
    const res = await apiClient.patch(`/commitments/${id}/status`, statusData);
    return res.data;
  }
};