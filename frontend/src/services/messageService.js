import api from './api';

export const messageService = {
  sendMessage: async (messageData) => {
    const { data } = await api.post('/messages', messageData);
    return data;
  },

  getMessages: async () => {
    const { data } = await api.get('/messages');
    return data;
  },

  getMessageById: async (id) => {
    const { data } = await api.get(`/messages/${id}`);
    return data;
  },

  updateMessageStatus: async (id, status) => {
    const { data } = await api.put(`/messages/${id}`, { status });
    return data;
  },

  deleteMessage: async (id) => {
    const { data } = await api.delete(`/messages/${id}`);
    return data;
  },
};

export default messageService;
