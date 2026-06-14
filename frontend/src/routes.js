import { lazy } from 'react';

const Home = lazy(() => import('./pages/Home'));
const Shop = lazy(() => import('./pages/Shop'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminCustomers = lazy(() => import('./pages/admin/AdminCustomers'));
const AdminAnalytics = lazy(() => import('./pages/admin/AdminAnalytics'));
const AdminBlog = lazy(() => import('./pages/admin/AdminBlog'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));
const OrderTracking = lazy(() => import('./pages/OrderTracking'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogDetail = lazy(() => import('./pages/BlogDetail'));
const Traceability = lazy(() => import('./pages/Traceability'));
const Compare = lazy(() => import('./pages/Compare'));
const StaticPage = lazy(() => import('./pages/StaticPage'));
const NotFound = lazy(() => import('./pages/NotFound'));

export const routes = [
  { path: '/', element: Home, layout: 'main' },
  { path: '/shop', element: Shop, layout: 'main' },
  { path: '/product/:id', element: ProductDetail, layout: 'main' },
  { path: '/cart', element: Cart, layout: 'main' },
  { path: '/checkout', element: Checkout, layout: 'main' },
  { path: '/login', element: Login, layout: 'auth' },
  { path: '/register', element: Register, layout: 'auth' },
  { path: '/dashboard', element: Dashboard, layout: 'main' },
  { path: '/admin', element: AdminDashboard, layout: 'admin' },
  { path: '/admin/products', element: AdminProducts, layout: 'admin' },
  { path: '/admin/orders', element: AdminOrders, layout: 'admin' },
  { path: '/admin/customers', element: AdminCustomers, layout: 'admin' },
  { path: '/admin/analytics', element: AdminAnalytics, layout: 'admin' },
  { path: '/admin/blog', element: AdminBlog, layout: 'admin' },
  { path: '/admin/settings', element: AdminSettings, layout: 'admin' },
  { path: '/track/:orderId', element: OrderTracking, layout: 'main' },
  { path: '/blog', element: Blog, layout: 'main' },
  { path: '/blog/:slug', element: BlogDetail, layout: 'main' },
  { path: '/traceability', element: Traceability, layout: 'main' },
  { path: '/compare', element: Compare, layout: 'main' },
  { path: '/about', element: () => <StaticPage type="/about" />, layout: 'main' },
  { path: '/faq', element: () => <StaticPage type="/faq" />, layout: 'main' },
  { path: '/contact', element: () => <StaticPage type="/contact" />, layout: 'main' },
  { path: '/privacy', element: () => <StaticPage type="/privacy" />, layout: 'main' },
  { path: '/terms', element: () => <StaticPage type="/terms" />, layout: 'main' },
  { path: '*', element: NotFound, layout: 'main' },
];

export default routes;
