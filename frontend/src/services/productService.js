import api from './api';

// ─── Mock fallback data (used only when backend is offline) ───────────────────
import { IMAGES } from '../utils/images';

export const MOCK_PRODUCTS = [
  {
    _id: '1', name: 'Virgin Cold-Pressed Coconut Oil', slug: 'virgin-cold-pressed',
    description: 'Single-origin virgin coconut oil cold-pressed within 4 hours of harvest from Pollachi farms. Rich in lauric acid with a delicate natural aroma.',
    price: 549, originalPrice: 649, size: '500ml', category: 'cooking',
    images: IMAGES.products.virgin,
    purityScore: 97, purityMetrics: { lauricAcid: 48.2, moisture: 0.05, ffa: 0.08, peroxide: 0.5 },
    batchId: 'PC-2026-A7K9M2', harvestDate: '2026-03-15', inStock: true, stock: 120,
    rating: 4.9, reviewCount: 234, tags: ['bestseller', 'organic'], usage: ['cooking', 'wellness'],
    farm: { name: 'Green Valley Estate', location: 'Pollachi, Tamil Nadu', farmer: 'Rajan Kumar' },
  },
  {
    _id: '2', name: 'Extra Virgin Premium Oil', slug: 'extra-virgin-premium',
    description: 'Our flagship extra virgin oil from mature coconuts. Glass-bottled to preserve freshness and nutrients.',
    price: 899, originalPrice: 1099, size: '1L', category: 'cooking',
    images: IMAGES.products.premium,
    purityScore: 99, purityMetrics: { lauricAcid: 49.5, moisture: 0.03, ffa: 0.05, peroxide: 0.3 },
    batchId: 'PC-2026-B3X8P1', harvestDate: '2026-03-10', inStock: true, stock: 85,
    rating: 5.0, reviewCount: 189, tags: ['premium', 'glass-bottle'], usage: ['cooking', 'wellness', 'skin'],
    farm: { name: 'Sunrise Coconut Grove', location: 'Pollachi, Tamil Nadu', farmer: 'Meena Devi' },
  },
  {
    _id: '3', name: 'Hair & Skin Care Oil', slug: 'hair-skin-care',
    description: 'Specially filtered for cosmetic use. Lightweight, non-greasy formula perfect for hair masks and skin nourishment.',
    price: 699, originalPrice: 799, size: '250ml', category: 'beauty',
    images: IMAGES.products.beauty,
    purityScore: 96, purityMetrics: { lauricAcid: 47.0, moisture: 0.06, ffa: 0.09, peroxide: 0.6 },
    batchId: 'PC-2026-C5N2R7', harvestDate: '2026-02-28', inStock: true, stock: 200,
    rating: 4.8, reviewCount: 156, tags: ['beauty', 'new'], usage: ['hair', 'skin'],
    farm: { name: 'Green Valley Estate', location: 'Pollachi, Tamil Nadu', farmer: 'Rajan Kumar' },
  },
  {
    _id: '4', name: 'Family Pack Value Oil', slug: 'family-pack',
    description: 'Economical 2L pack for families. Same premium quality, better value. Perfect for daily cooking needs.',
    price: 1499, originalPrice: 1799, size: '2L', category: 'cooking',
    images: IMAGES.products.family,
    purityScore: 94, purityMetrics: { lauricAcid: 46.5, moisture: 0.08, ffa: 0.1, peroxide: 0.8 },
    batchId: 'PC-2026-D1W4T9', harvestDate: '2026-03-01', inStock: true, stock: 60,
    rating: 4.7, reviewCount: 98, tags: ['value', 'family'], usage: ['cooking'],
    farm: { name: 'Heritage Farms', location: 'Pollachi, Tamil Nadu', farmer: 'Selvam P.' },
  },
  {
    _id: '5', name: 'Ayurvedic Wellness Oil', slug: 'ayurvedic-wellness',
    description: 'Traditional wood-pressed oil for daily wellness rituals — oil pulling, massage, and morning consumption.',
    price: 799, originalPrice: 949, size: '500ml', category: 'wellness',
    images: IMAGES.products.wellness,
    purityScore: 98, purityMetrics: { lauricAcid: 48.8, moisture: 0.04, ffa: 0.06, peroxide: 0.4 },
    batchId: 'PC-2026-E8H3V5', harvestDate: '2026-03-18', inStock: true, stock: 95,
    rating: 4.9, reviewCount: 142, tags: ['wellness', 'organic'], usage: ['wellness', 'skin'],
    farm: { name: 'Sunrise Coconut Grove', location: 'Pollachi, Tamil Nadu', farmer: 'Meena Devi' },
  },
  {
    _id: '6', name: 'Organic Farm Reserve', slug: 'organic-farm-reserve',
    description: 'Limited edition from certified organic plots. Small-batch pressed and numbered.',
    price: 1299, originalPrice: 1499, size: '750ml', category: 'cooking',
    images: IMAGES.products.organic,
    purityScore: 99, purityMetrics: { lauricAcid: 49.8, moisture: 0.02, ffa: 0.04, peroxide: 0.2 },
    batchId: 'PC-2026-F2K7N4', harvestDate: '2026-03-20', inStock: true, stock: 40,
    rating: 5.0, reviewCount: 67, tags: ['premium', 'organic', 'new'], usage: ['cooking', 'wellness'],
    farm: { name: 'Heritage Farms', location: 'Pollachi, Tamil Nadu', farmer: 'Selvam P.' },
  },
];

export const MOCK_REVIEWS = [
  { id: 1, user: 'Priya S.', rating: 5, text: 'The aroma is incredible — you can tell this is fresh from the farm. My dosa tastes amazing!', image: IMAGES.avatars.priya, date: '2026-05-01' },
  { id: 2, user: 'Arun M.', rating: 5, text: 'Verified the batch online — full traceability is a game changer. Premium quality.', image: IMAGES.avatars.arun, date: '2026-04-28' },
  { id: 3, user: 'Lakshmi R.', rating: 4, text: 'Using it for hair oiling weekly. Hair feels softer and healthier.', image: IMAGES.avatars.lakshmi, date: '2026-04-20' },
  { id: 4, user: 'Kavya N.', rating: 5, text: 'Subscribed to the Family plan — never going back to store-bought oil.', image: IMAGES.avatars.kavya, date: '2026-04-12' },
];

export const MOCK_BLOGS = [
  { _id: '1', title: 'The Art of Cold-Pressing Coconut Oil in Pollachi', slug: 'art-of-cold-pressing', excerpt: 'Discover how traditional methods meet modern quality standards.', image: IMAGES.blogs.coldPress, author: 'PureCoco Team', date: '2026-05-01', readTime: '5 min', category: 'Process' },
  { _id: '2', title: '5 Ways to Use Coconut Oil in Your Daily Routine', slug: '5-ways-coconut-oil', excerpt: 'From cooking to skincare — unlock the full potential of pure coconut oil.', image: IMAGES.blogs.wellness, author: 'Dr. Ananya Iyer', date: '2026-04-25', readTime: '4 min', category: 'Wellness' },
  { _id: '3', title: 'Meet the Farmers: Rajan Kumar of Green Valley Estate', slug: 'meet-farmer-rajan', excerpt: 'A third-generation coconut farmer shares his passion for sustainable agriculture.', image: IMAGES.blogs.farmer, author: 'PureCoco Team', date: '2026-04-15', readTime: '6 min', category: 'Harvest Story' },
  { _id: '4', title: 'Cooking with Coconut Oil: A South Indian Guide', slug: 'cooking-guide', excerpt: 'Master the art of tempering, frying, and baking with pure coconut oil.', image: IMAGES.blogs.cooking, author: 'Chef Meenakshi', date: '2026-04-08', readTime: '7 min', category: 'Recipes' },
  { _id: '5', title: 'Sustainable Farming Practices in Pollachi', slug: 'sustainable-farming', excerpt: 'How our partner farms protect soil health and biodiversity.', image: IMAGES.blogs.sustainability, author: 'PureCoco Team', date: '2026-03-28', readTime: '5 min', category: 'Sustainability' },
];

export const MOCK_CUSTOMERS = [
  { id: '1', name: 'Priya Sharma', email: 'priya@email.com', orders: 8, spent: 12450, joined: '2025-11-02' },
  { id: '2', name: 'Arun Menon', email: 'arun@email.com', orders: 5, spent: 7890, joined: '2026-01-15' },
  { id: '3', name: 'Lakshmi Ravi', email: 'lakshmi@email.com', orders: 12, spent: 18200, joined: '2025-08-20' },
  { id: '4', name: 'Kavya Nair', email: 'kavya@email.com', orders: 3, spent: 4200, joined: '2026-02-10' },
  { id: '5', name: 'Suresh Babu', email: 'suresh@email.com', orders: 6, spent: 9600, joined: '2025-12-05' },
];

// ─── Service ──────────────────────────────────────────────────────────────────
export const productService = {
  getAll: async (params = {}) => {
    try {
      const { data } = await api.get('/products', { params });
      return data;
    } catch {
      return { products: MOCK_PRODUCTS, total: MOCK_PRODUCTS.length };
    }
  },

  getById: async (id) => {
    try {
      const { data } = await api.get(`/products/${id}`);
      return data;
    } catch {
      return MOCK_PRODUCTS.find((p) => p._id === id) || null;
    }
  },

  verifyBatch: async (batchId) => {
    try {
      const { data } = await api.get(`/products/verify/${batchId}`);
      return data;
    } catch {
      const product = MOCK_PRODUCTS.find((p) => p.batchId === batchId);
      return product
        ? { verified: true, product, message: 'Batch verified successfully' }
        : { verified: false, message: 'Batch ID not found' };
    }
  },

  getBlogs: async () => {
    try {
      const { data } = await api.get('/blogs');
      // Normalize to an object with a `blogs` array for predictable consumption
      if (Array.isArray(data)) return { blogs: data };
      if (data && data.blogs) return { blogs: data.blogs };
      return { blogs: [] };
    } catch {
      return { blogs: MOCK_BLOGS };
    }
  },

  getBlogBySlug: async (slug) => {
    try {
      const { data } = await api.get(`/blogs/${slug}`);
      // API may return the blog object directly or wrapped — normalize to object
      if (!data) return null;
      if (data.blog) return data.blog;
      return data;
    } catch {
      return MOCK_BLOGS.find((b) => b.slug === slug) || null;
    }
  },

  createProduct: async (productData) => {
    const { data } = await api.post('/products', productData);
    return data;
  },

  updateProduct: async (id, productData) => {
    const { data } = await api.put(`/products/${id}`, productData);
    return data;
  },

  deleteProduct: async (id) => {
    const { data } = await api.delete(`/products/${id}`);
    return data;
  },

  createBlog: async (blogData) => {
    const { data } = await api.post('/blogs', blogData);
    return data;
  },

  updateBlog: async (slug, blogData) => {
    const { data } = await api.put(`/blogs/${slug}`, blogData);
    return data;
  },

  deleteBlog: async (slug) => {
    const { data } = await api.delete(`/blogs/${slug}`);
    return data;
  },
};

export default productService;
