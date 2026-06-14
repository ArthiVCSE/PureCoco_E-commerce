import api from './api';

export const wishlistService = {
  getWishlist: async () => {
    const { data } = await api.get('/users/wishlist');
    return data;
  },

  addToWishlist: async (productId) => {
    const { data } = await api.post('/users/wishlist/add', { productId });
    return data;
  },

  removeFromWishlist: async (productId) => {
    const { data } = await api.post('/users/wishlist/remove', { productId });
    return data;
  },
};

export default wishlistService;
