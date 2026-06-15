import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatCurrency';
import Badge from '../ui/Badge';

const statusColors = {
  pending: 'warning',
  processing: 'default',
  shipped: 'gold',
  delivered: 'success',
  cancelled: 'danger',
};

const paymentColors = {
  pending: 'warning',
  paid: 'success',
  failed: 'danger',
};

const OrderTable = ({ orders }) => {
  if (!orders?.length) {
    return (
      <div className="text-center py-12 text-coconut/50 dark:text-cream/50">
        No orders found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl bg-white dark:bg-coconut-light/10 shadow-soft">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-coconut/10 dark:border-cream/10 bg-coconut/5 dark:bg-cream/5">
            <th className="text-left p-4 font-semibold text-coconut/80 dark:text-cream/80">Order ID</th>
            <th className="text-left p-4 font-semibold text-coconut/80 dark:text-cream/80">Date</th>
            <th className="text-left p-4 font-semibold text-coconut/80 dark:text-cream/80">Items</th>
            <th className="text-left p-4 font-semibold text-coconut/80 dark:text-cream/80">Total</th>
            <th className="text-left p-4 font-semibold text-coconut/80 dark:text-cream/80">Payment</th>
            <th className="text-left p-4 font-semibold text-coconut/80 dark:text-cream/80">Status</th>
            <th className="text-left p-4 font-semibold text-coconut/80 dark:text-cream/80">Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id} className="border-b border-coconut/5 dark:border-cream/5 hover:bg-coconut/5 dark:hover:bg-cream/5 transition-colors">
              <td className="p-4 font-medium">#{order._id.slice(-6).toUpperCase()}</td>
              <td className="p-4">{formatDate(order.createdAt)}</td>
              <td className="p-4">{order.items?.length || 0} items</td>
              <td className="p-4 font-medium">{formatCurrency(order.total)}</td>
              <td className="p-4">
                <div className="flex flex-col gap-1">
                  <Badge variant={paymentColors[order.paymentStatus] || 'default'}>
                    {order.paymentStatus || 'pending'}
                  </Badge>
                  <span className="text-xs text-coconut/50 dark:text-cream/50 uppercase">{order.paymentMethod || 'cod'}</span>
                </div>
              </td>
              <td className="p-4">
                <Badge variant={statusColors[order.status] || 'default'}>
                  {order.status}
                </Badge>
              </td>
              <td className="p-4">
                <Link
                  to={`/track/${order._id}`}
                  className="inline-flex items-center gap-1 text-gold hover:text-gold-dark transition-colors"
                >
                  <Eye size={16} /> Track
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;
