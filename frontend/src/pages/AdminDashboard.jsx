import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, ShoppingCart, Users, TrendingUp, Package, ArrowRight, Eye, Star, Mail, Bell } from 'lucide-react';
import AdminLayout from '../components/admin/AdminLayout';
import StatCard from '../components/dashboard/StatCard';
import DataTable from '../components/admin/DataTable';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { formatCurrency, formatDate } from '../utils/formatCurrency';
import api from '../services/api';

const statusVariant = {
  pending: 'warning', processing: 'default', shipped: 'gold',
  'out-for-delivery': 'natural', delivered: 'success', cancelled: 'danger',
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({ products: 0, orders: 0, users: 0, revenue: 0, reviews: 0, unreadMessages: 0, unreadNotifications: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [analyticsData, setAnalyticsData] = useState({ months: [], revenueByMonth: [], ordersByMonth: [] });

  useEffect(() => {
    const load = async () => {
      try {
        const [ordersRes, productsRes, usersRes, reviewsRes, messagesRes, notificationsRes] = await Promise.allSettled([
          api.get('/orders'),
          api.get('/products'),
          api.get('/users'),
          api.get('/reviews'),
          api.get('/messages'),
          api.get('/notifications'),
        ]);
        const orders = ordersRes.status === 'fulfilled' ? (ordersRes.value.data || []) : [];
        const products = productsRes.status === 'fulfilled' ? (productsRes.value.data?.products || []) : [];
        const users = usersRes.status === 'fulfilled' ? (usersRes.value.data || []) : [];
        const reviews = reviewsRes.status === 'fulfilled' ? (reviewsRes.value.data || []) : [];
        const messages = messagesRes.status === 'fulfilled' ? (messagesRes.value.data || []) : [];
        const notifications = notificationsRes.status === 'fulfilled' ? (notificationsRes.value.data || []) : [];
        setStats({
          products: products.length || 6,
          orders: orders.length,
          users: users.length,
          revenue: orders.reduce((s, o) => s + (o.total || 0), 0),
          reviews: reviews.length,
          unreadMessages: messages.filter(m => !m.isRead).length,
          unreadNotifications: notifications.filter(n => !n.isRead).length,
        });
        setRecentOrders(orders.slice(0, 6).map(o => ({
          id: o._id,
          _id: o._id,
          orderId: `#${o._id.slice(-6).toUpperCase()}`,
          customer: o.shippingAddress?.fullName || o.user?.name || 'Guest',
          total: o.total,
          status: o.status,
          createdAt: o.createdAt,
        })));
        const productSales = new Map();
        orders.forEach(order => {
          order.items?.forEach(item => {
            const key = item.product || item.name;
            const current = productSales.get(key) || { name: item.name, sales: 0, revenue: 0 };
            current.sales += item.quantity || 0;
            current.revenue += (item.price || 0) * (item.quantity || 0);
            productSales.set(key, current);
          });
        });
        const top = Array.from(productSales.values()).sort((a, b) => b.sales - a.sales).slice(0, 5);
        const maxSales = top[0]?.sales || 1;
        setTopProducts(top.map(item => ({ ...item, pct: Math.max(8, Math.round((item.sales / maxSales) * 100)) })));
      } catch {
        const local = JSON.parse(localStorage.getItem('purecoco_orders') || '[]');
        setStats({ products: 0, orders: local.length, users: 0, revenue: local.reduce((s, o) => s + (o.total || 0), 0), reviews: 0, unreadMessages: 0, unreadNotifications: 0 });
        setRecentOrders(local.slice(0, 6).map(o => ({
          id: o._id, _id: o._id, orderId: `#${o._id.slice(-6).toUpperCase()}`,
          customer: o.shippingAddress?.fullName || o.shipping?.fullName || 'Guest',
          total: o.total, status: o.status, createdAt: o.createdAt,
        })));
      }
    };
    load();
  }, []);

  // Fetch analytics data for overview charts
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await api.get('/orders/analytics');
        setAnalyticsData({
          months: data.months || [],
          revenueByMonth: data.revenueByMonth || [],
          ordersByMonth: data.ordersByMonth || [],
        });
      } catch (err) {
        console.error('Failed to fetch analytics', err);
      }
    };
    fetchAnalytics();
  }, []);


  const orderColumns = [
    { key: 'orderId', label: 'Order', render: row => <span className="font-mono text-xs font-bold">{row.orderId}</span> },
    { key: 'customer', label: 'Customer', render: row => <span className="text-sm font-semibold">{row.customer}</span> },
    { key: 'total', label: 'Total', render: row => <span className="font-bold">{formatCurrency(row.total)}</span> },
    { key: 'date', label: 'Date', render: row => <span className="text-xs text-muted">{formatDate(row.createdAt)}</span> },
    { key: 'status', label: 'Status', render: row => <Badge variant={statusVariant[row.status] || 'default'}>{row.status}</Badge> },
    {
      key: 'action', label: '', render: row => (
        <Link to={`/track/${row._id}`} className="text-gold hover:text-gold-dark transition-colors">
          <Eye size={15} />
        </Link>
      )
    },
  ];

  return (
    <AdminLayout title="Dashboard Overview" subtitle="Welcome back to PureCoco Admin">

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Revenue" value={formatCurrency(stats.revenue)} change="+12.5%" icon={DollarSign} />
        <StatCard title="Total Orders" value={stats.orders} change="+8.2%" icon={ShoppingCart} />
        <StatCard title="Customers" value={stats.users} change="+5.1%" icon={Users} />
        <StatCard title="Products" value={stats.products} icon={Package} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Link to="/admin/reviews"><StatCard title="Reviews" value={stats.reviews} icon={Star} /></Link>
        <Link to="/admin/messages"><StatCard title="Unread Messages" value={stats.unreadMessages} icon={Mail} /></Link>
        <Link to="/admin/notifications"><StatCard title="Unread Notifications" value={stats.unreadNotifications} icon={Bell} /></Link>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

        {/* Revenue Bar Chart */}
        <div className="p-6 card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg font-semibold text-body flex items-center gap-2">
              <TrendingUp size={20} className="text-gold" /> Monthly Revenue
            </h2>
          </div>
          <div className="h-44 flex items-end gap-2">
            {analyticsData.months.map((month, idx) => {
              const val = analyticsData.revenueByMonth[idx] || 0;
              const maxVal = Math.max(...analyticsData.revenueByMonth, 1);
              const h = Math.round((val / maxVal) * 100);
              return (
                <div key={month} className="flex flex-col items-center gap-1 flex-1 group cursor-pointer">
                  <span className="text-[9px] font-bold text-muted group-hover:text-coconut dark:group-hover:text-cream transition-colors">{formatCurrency(val)}</span>
                  <div className="w-full bg-gold/40 hover:bg-gold rounded-t-md transition-all duration-300 group-hover:shadow-md" style={{ height: `${h}%` }} title={formatCurrency(val)} />
                  <span className="text-[10px] font-bold text-coconut/70 dark:text-cream/70">{month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weekly Activity */}
        <div className="p-6 card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg font-semibold text-body flex items-center gap-2">
              <ShoppingCart size={20} className="text-natural" /> Orders This Week
            </h2>
          </div>
          <div className="h-44 flex items-end gap-2">
            {analyticsData.months.map((month, idx) => {
              const val = analyticsData.ordersByMonth[idx] || 0;
              const maxVal = Math.max(...analyticsData.ordersByMonth, 1);
              const h = Math.round((val / maxVal) * 100);
              return (
                <div key={month} className="flex flex-col items-center gap-1 flex-1 group cursor-pointer">
                  <span className="text-[10px] font-bold text-muted">{val}</span>
                  <div className="w-full bg-natural/40 hover:bg-natural rounded-t-md transition-all duration-300" style={{ height: `${h}%` }} />
                  <span className="text-[10px] font-bold text-coconut/70 dark:text-cream/70">{month}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Orders + Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">

        {/* Recent Orders */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold text-body">Recent Orders</h2>
            <Link to="/admin/orders" className="text-gold text-sm font-sans font-semibold flex items-center gap-1 hover:text-gold-dark">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <DataTable
            columns={orderColumns}
            data={recentOrders}
            searchable={false}
          />
        </div>

        {/* Top Products */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold text-body">Top Products</h2>
            <Link to="/admin/products" className="text-gold text-sm font-sans font-semibold flex items-center gap-1 hover:text-gold-dark">
              Manage <ArrowRight size={14} />
            </Link>
          </div>
          <div className="p-5 card space-y-4">
            {topProducts.length ? topProducts.map((item, idx) => (
              <div key={`${item.name}-${idx}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-sans font-semibold text-body truncate max-w-[130px]" title={item.name}>{item.name}</span>
                  <span className="text-xs text-muted font-sans shrink-0 ml-2">{item.sales} sold</span>
                </div>
                <div className="h-2 bg-coconut/10 dark:bg-cream/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-gold to-natural rounded-full transition-all duration-500" style={{ width: `${item.pct}%` }} />
                </div>
                <p className="text-[10px] text-muted mt-0.5 text-right">{formatCurrency(item.revenue)}</p>
              </div>
            )) : (
              <p className="text-sm text-muted">No top product insights available yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-5 card">
        <h2 className="font-display text-lg font-semibold text-body mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/products"><Button variant="secondary" size="sm" icon={Package}>Add Product</Button></Link>
          <Link to="/admin/orders"><Button variant="outline" size="sm" icon={ShoppingCart}>View Orders</Button></Link>
          <Link to="/admin/messages"><Button variant="ghost" size="sm" icon={Mail}>Messages</Button></Link>
          <Link to="/admin/notifications"><Button variant="ghost" size="sm" icon={Bell}>Notifications</Button></Link>
          <Link to="/admin/blog"><Button variant="ghost" size="sm">Write Blog Post</Button></Link>
          <Link to="/admin/analytics"><Button variant="ghost" size="sm" icon={TrendingUp}>Analytics</Button></Link>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
