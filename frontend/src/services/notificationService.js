import api from './api';

export const notificationService = {
  createNotification: async (notificationData) => {
    const { data } = await api.post('/notifications', notificationData);
    return data;
  },

  getUserNotifications: async (userId) => {
    const { data } = await api.get(`/notifications/user/${userId}`);
    return data;
  },

  getNotifications: async () => {
    const { data } = await api.get('/notifications');
    return data;
  },

  markAsRead: async (id) => {
    const { data } = await api.put(`/notifications/${id}/read`);
    return data;
  },

  markAllAsRead: async (userId) => {
    const { data } = await api.put(`/notifications/user/${userId}/read-all`);
    return data;
  },

  deleteNotification: async (id) => {
    const { data } = await api.delete(`/notifications/${id}`);
    return data;
  },
};

export default notificationService;
