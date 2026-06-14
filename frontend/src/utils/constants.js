export const APP_NAME = 'PureCoco';
export const APP_TAGLINE = 'From Pollachi Farms to Your Table';
export const APP_DESCRIPTION = 'Premium cold-pressed virgin coconut oil with farm-to-bottle traceability.';

export const COLORS = {
  coconut: '#5A4633',
  cream: '#F7F3EC',
  gold: '#C89B3C',
  natural: '#4F7942',
};

export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const ROUTES = {
  HOME: '/',
  SHOP: '/shop',
  PRODUCT: '/product/:id',
  CART: '/cart',
  CHECKOUT: '/checkout',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  ADMIN: '/admin',
  ORDER_TRACKING: '/track/:orderId',
  BLOG: '/blog',
  BLOG_DETAIL: '/blog/:slug',
  TRACEABILITY: '/traceability',
  COMPARE: '/compare',
};


export const USAGE_RECOMMENDATIONS = {
  cooking: { daily: '1-2 tbsp', bestFor: 'Sautéing, baking, stir-fry', temp: 'Up to 350°F' },
  hair: { daily: '2-3 tsp', bestFor: 'Scalp massage, deep conditioning', temp: 'Room temperature' },
  skin: { daily: '1 tsp', bestFor: 'Moisturizer, makeup remover', temp: 'Room temperature' },
  wellness: { daily: '1 tbsp', bestFor: 'Morning consumption, oil pulling', temp: 'Room temperature' },
};

export const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Shop', path: '/shop' },
  { label: 'Traceability', path: '/traceability' },
  { label: 'Blog', path: '/blog' },
];

export const FOOTER_LINKS = {
  shop: [
    { label: 'All Products', path: '/shop' },
    { label: 'Compare', path: '/compare' },
  ],
  company: [
    { label: 'About Us', path: '/about' },
    { label: 'Traceability', path: '/traceability' },
    { label: 'Blog', path: '/blog' },
  ],
  support: [
    { label: 'Track Order', path: '/dashboard' },
    { label: 'Contact Us', path: '/contact' },
    { label: 'FAQ', path: '/faq' },
  ],
};
