import apiClient from '../../lib/apiClient';

export const reportService = {
  getDailyReport: async (date) => {
    const res = await apiClient.get(`/reports/daily?date=${date}`);
    return res.data;
  },
  getWeeklyReport: async (startDate, endDate) => {
    const res = await apiClient.get(`/reports/weekly?startDate=${startDate}&endDate=${endDate}`);
    return res.data;
  }
};