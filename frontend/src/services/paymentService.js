import api from './api';

export const paymentService = {
  createPaymentIntent: async (orderId) => {
    const response = await api.post('/payments/create-payment-intent', { orderId });
    return response.data;
  },
};

export default paymentService;
