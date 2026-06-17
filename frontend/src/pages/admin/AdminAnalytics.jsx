import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import StatCard from '../../components/dashboard/StatCard';
import { DollarSign, ShoppingCart, Users, TrendingUp, Package } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';
import api from '../../services/api';

const AdminAnalytics = () => {
  const [data, setData] = useState({
    totalRevenue: 248500,
    totalOrders: 156,
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    revenueByMonth: [180000, 220000, 195000, 280000, 310000, 248000],
    ordersByMonth: [45, 52, 48, 68, 72, 58],
  });

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await api.get('/orders/analytics');
        if (mounted && res.data && res.data.months) {
          setData(res.data);
        }
      } catch { /* use default mock */ }
    };
    
    load();
    const interval = setInterval(load, 5000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const maxRevenue = Math.max(...data.revenueByMonth, 1);
  const maxOrders = Math.max(...data.ordersByMonth, 1);

  return (
    <AdminLayout title="Analytics" subtitle="Sales performance and business insights">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard title="Total Revenue" value={formatCurrency(data.totalRevenue)} change="+12.5%" icon={DollarSign} />
        <StatCard title="Total Orders" value={data.totalOrders} change="+8.2%" icon={ShoppingCart} />
        <StatCard title="New Customers" value="84" change="+15.3%" icon={Users} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="p-6 card">
          <h2 className="font-display text-lg font-semibold text-body mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-gold" /> Revenue Trend
          </h2>
          <div className="overflow-x-auto pb-2 scrollbar-hide">
            <div className="h-56 min-w-[300px] flex items-end justify-around gap-3">
            {data.revenueByMonth.map((val, i) => (
              <div key={data.months[i]} className="flex flex-col items-center gap-2 flex-1">
                <span className="text-xs font-sans font-semibold text-coconut/70 dark:text-cream/70">{formatCurrency(val)}</span>
                <div
                  className="w-full bg-gold/50 rounded-t-lg hover:bg-gold transition-colors"
                  style={{ height: `${(val / maxRevenue) * 100}%` }}
                />
                <span className="text-xs font-sans font-bold text-coconut/80 dark:text-cream/80">{data.months[i]}</span>
              </div>
            ))}
            </div>
          </div>
        </div>

        <div className="p-6 card">
          <h2 className="font-display text-lg font-semibold text-body mb-6 flex items-center gap-2">
            <Package size={20} className="text-natural" /> Orders by Month
          </h2>
          <div className="overflow-x-auto pb-2 scrollbar-hide">
            <div className="h-56 min-w-[300px] flex items-end justify-around gap-3">
            {data.ordersByMonth.map((val, i) => (
              <div key={data.months[i]} className="flex flex-col items-center gap-2 flex-1">
                <span className="text-xs font-sans font-semibold text-coconut/70 dark:text-cream/70">{val}</span>
                <div
                  className="w-full bg-natural/50 rounded-t-lg hover:bg-natural transition-colors"
                  style={{ height: `${(val / maxOrders) * 100}%` }}
                />
                <span className="text-xs font-sans font-bold text-coconut/80 dark:text-cream/80">{data.months[i]}</span>
              </div>
            ))}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 card">
        <h2 className="font-display text-lg font-semibold text-body mb-4">Top Performing Products</h2>
        <div className="space-y-3">
          {[
            { name: 'Virgin Cold-Pressed Coconut Oil', sales: 234, pct: 92 },
            { name: 'Extra Virgin Premium Oil', sales: 189, pct: 78 },
            { name: 'Ayurvedic Wellness Oil', sales: 142, pct: 65 },
            { name: 'Hair & Skin Care Oil', sales: 156, pct: 58 },
          ].map((item, idx) => (
            <div key={`${item.name}-${idx}`} className="flex items-center gap-4">
              <span className="text-sm font-sans text-body flex-1">{item.name}</span>
              <span className="text-sm text-muted font-sans w-16 text-right">{item.sales} sold</span>
              <div className="w-32 h-2 bg-coconut/10 dark:bg-cream/10 rounded-full overflow-hidden">
                <div className="h-full bg-gold rounded-full" style={{ width: `${item.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;
