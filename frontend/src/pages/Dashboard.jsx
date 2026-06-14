import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Package, Heart, Settings, LogOut, Trash2, Edit2, Save, X, ShoppingBag, Navigation } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import OrderTable from '../components/dashboard/OrderTable';
import StatCard from '../components/dashboard/StatCard';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import { formatCurrency, formatDate } from '../utils/formatCurrency';
import { MOCK_PRODUCTS } from '../services/productService';
import api from '../services/api';
import { useToast } from '../components/common/Toast';

const Dashboard = () => {
  const { user, isAuthenticated, logout, register } = useAuth();
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem('purecoco_wishlist') || '[]'); } catch { return []; }
  });
  const [activeTab, setActiveTab] = useState('orders');
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: '', email: '' });
  const { addToast } = useToast();

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const { data } = await api.get('/orders/my');
        setOrders(data);
      } catch {
        const stored = JSON.parse(localStorage.getItem('purecoco_orders') || '[]');
        setOrders(stored);
      }
    };
    if (isAuthenticated) {
      loadOrders();
      setProfileForm({ name: user?.name || '', email: user?.email || '' });
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    localStorage.setItem('purecoco_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const totalSpent = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const activeOrders = orders.filter(o => !['delivered', 'cancelled'].includes(o.status)).length;

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      await api.put('/auth/profile', profileForm);
      const updatedUser = { ...user, ...profileForm };
      localStorage.setItem('purecoco_user', JSON.stringify(updatedUser));
      addToast('Profile updated successfully!', 'success');
    } catch {
      addToast('Profile saved locally', 'info');
    }
    setEditingProfile(false);
  };

  const removeFromWishlist = (id) => {
    setWishlist(prev => prev.filter(w => w._id !== id));
    addToast('Removed from wishlist', 'info');
  };

  const tabs = [
    { id: 'orders', label: 'My Orders', icon: Package, count: orders.length },
    { id: 'wishlist', label: 'Wishlist', icon: Heart, count: wishlist.length },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="container-main pt-24 pb-16 animate-fade-in font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-coconut dark:text-cream">
            Hello, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-muted font-sans mt-1">Manage your orders, wishlist, and account</p>
        </div>
        <Button variant="ghost" icon={LogOut} onClick={logout} className="self-start sm:self-auto">Logout</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Orders" value={orders.length} icon={Package} />
        <StatCard title="Active Orders" value={activeOrders} icon={Navigation} />
        <StatCard title="Total Spent" value={formatCurrency(totalSpent)} icon={ShoppingBag} />
        <StatCard title="Wishlist Items" value={wishlist.length} icon={Heart} />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide border-b border-coconut/10 dark:border-cream/10 pb-0">
        {tabs.map(({ id, label, icon: Icon, count }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-sans font-semibold whitespace-nowrap border-b-2 transition-colors -mb-px ${
              activeTab === id
                ? 'border-gold text-gold'
                : 'border-transparent text-coconut/60 dark:text-cream/60 hover:text-coconut dark:hover:text-cream'
            }`}
          >
            <Icon size={16} />
            {label}
            {count !== undefined && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === id ? 'bg-gold text-white' : 'bg-coconut/10 dark:bg-cream/10 text-muted'}`}>
                {count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        orders.length > 0 ? (
          <OrderTable orders={orders} />
        ) : (
          <div className="text-center py-20 card">
            <Package size={56} className="mx-auto text-muted mb-4 opacity-40" />
            <p className="text-muted mb-6 font-sans text-lg">No orders placed yet</p>
            <Link to="/shop">
              <Button variant="secondary" size="lg">Start Shopping</Button>
            </Link>
          </div>
        )
      )}

      {/* Wishlist Tab */}
      {activeTab === 'wishlist' && (
        wishlist.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {wishlist.map(item => (
              <div key={item._id} className="flex gap-4 p-4 card">
                <img
                  src={item.images?.[0] || 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=100&q=80'}
                  alt={item.name}
                  className="w-20 h-20 rounded-xl object-cover border border-coconut/10 dark:border-cream/10 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item._id}`} className="font-display font-semibold text-body hover:text-gold transition-colors text-sm line-clamp-2">
                    {item.name}
                  </Link>
                  <p className="text-xs text-muted font-sans mt-1">{item.size}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <p className="font-sans font-bold text-gold">{formatCurrency(item.price)}</p>
                    {item.originalPrice > item.price && (
                      <p className="text-xs text-muted line-through">{formatCurrency(item.originalPrice)}</p>
                    )}
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Link to={`/product/${item._id}`} className="text-xs px-2 py-1 rounded bg-gold text-white font-semibold hover:bg-gold-dark transition-colors">
                      Buy Now
                    </Link>
                    <button
                      onClick={() => removeFromWishlist(item._id)}
                      className="text-xs px-2 py-1 rounded border border-red-300 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 card">
            <Heart size={56} className="mx-auto text-muted mb-4 opacity-40" />
            <p className="text-muted font-sans text-lg mb-4">Your wishlist is empty</p>
            <Link to="/shop"><Button variant="secondary">Explore Products</Button></Link>
          </div>
        )
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Profile Section */}
          <div className="p-6 card">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display text-lg font-semibold text-body">Profile Information</h3>
              <button
                onClick={() => setEditingProfile(!editingProfile)}
                className="p-2 rounded-lg hover:bg-gold/10 text-gold transition-colors"
                aria-label="Edit profile"
              >
                {editingProfile ? <X size={18} /> : <Edit2 size={18} />}
              </button>
            </div>

            {editingProfile ? (
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <Input
                  label="Full Name"
                  value={profileForm.name}
                  onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                  required
                />
                <Input
                  label="Email Address"
                  type="email"
                  value={profileForm.email}
                  onChange={e => setProfileForm({ ...profileForm, email: e.target.value })}
                  required
                />
                <div className="flex gap-3">
                  <Button type="submit" variant="secondary" size="sm" icon={Save}>Save Changes</Button>
                  <Button type="button" variant="ghost" size="sm" onClick={() => setEditingProfile(false)}>Cancel</Button>
                </div>
              </form>
            ) : (
              <div className="space-y-3 text-sm font-sans">
                <div className="flex justify-between py-2.5 border-b border-coconut/8 dark:border-cream/8">
                  <span className="text-muted font-medium">Name</span>
                  <span className="font-semibold text-body">{user?.name}</span>
                </div>
                <div className="flex justify-between py-2.5 border-b border-coconut/8 dark:border-cream/8">
                  <span className="text-muted font-medium">Email</span>
                  <span className="font-semibold text-body">{user?.email}</span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-muted font-medium">Role</span>
                  <Badge variant={user?.role === 'admin' ? 'gold' : 'natural'}>{user?.role}</Badge>
                </div>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="p-6 card">
            <h3 className="font-display text-lg font-semibold text-body mb-5">Quick Links</h3>
            <div className="space-y-3">
              {[
                { label: 'Browse Products', path: '/shop', icon: ShoppingBag, desc: 'Explore our premium coconut oils' },
                { label: 'Batch Traceability', path: '/traceability', icon: Package, desc: 'Verify your batch authenticity' },
                { label: 'Compare Products', path: '/compare', icon: Package, desc: 'Compare products side by side' },
                { label: 'Read Blog', path: '/blog', icon: Package, desc: 'Tips, stories, and wellness' },
              ].map(({ label, path, icon: Icon, desc }) => (
                <Link key={path} to={path} className="flex items-center gap-3 p-3 rounded-xl hover:bg-coconut/5 dark:hover:bg-cream/5 transition-colors group">
                  <div className="w-9 h-9 rounded-lg bg-gold/10 flex items-center justify-center text-gold shrink-0 group-hover:bg-gold/20 transition-colors">
                    <Icon size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-sans font-semibold text-body group-hover:text-gold transition-colors">{label}</p>
                    <p className="text-xs text-muted">{desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Danger Zone */}
          <div className="p-6 card border border-red-100 dark:border-red-900/30">
            <h3 className="font-display text-lg font-semibold text-red-600 mb-4">Account Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => { if (window.confirm('Clear all local order data?')) { localStorage.removeItem('purecoco_orders'); setOrders([]); addToast('Local order data cleared', 'info'); } }}
                className="text-sm text-red-500 font-sans font-semibold hover:underline"
              >
                Clear Local Order History
              </button>
              <br />
              <button
                onClick={() => { if (window.confirm('Are you sure you want to log out?')) logout(); }}
                className="text-sm text-red-500 font-sans font-semibold hover:underline flex items-center gap-1"
              >
                <LogOut size={14} /> Logout from all sessions
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
