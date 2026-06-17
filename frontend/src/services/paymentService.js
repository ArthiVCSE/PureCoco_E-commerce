import api from './api';

export const paymentService = {
  createRazorpayOrder: async (orderId) => {
    const response = await api.post('/payments/create-razorpay-order', { orderId });
    return response.data;
  },

  verifyRazorpayPayment: async (verificationData) => {
    const response = await api.post('/payments/verify-payment', verificationData);
    return response.data;
  },

  completeDemoPayment: async (orderId) => {
    const response = await api.post('/payments/demo-complete', { orderId });
    return response.data;
  },
};

export default paymentService;
