import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Edit, Trash2 } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import DataTable from '../../components/admin/DataTable';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useToast } from '../../components/common/Toast';
import { formatCurrency, formatDate } from '../../utils/formatCurrency';
import api from '../../services/api';

const statusVariant = {
  pending: 'warning',
  processing: 'default',
  shipped: 'gold',
  'out-for-delivery': 'natural',
  delivered: 'success',
  cancelled: 'danger',
};

const paymentVariant = {
  pending: 'warning',
  paid: 'success',
  failed: 'danger',
};

const defaultOrders = [
  { id: '1', _id: 'ORD001A7K9', customer: 'Priya Sharma', email: 'priya@email.com', total: 1548, status: 'delivered', createdAt: '2026-05-28', items: [{ name: 'Virgin Coconut Oil', quantity: 2, price: 549 }], shippingAddress: { fullName: 'Priya Sharma', address: '12 Park St', city: 'Chennai', pincode: '600001' }, tracking: { carrier: 'BlueDart', trackingId: 'BD12345' } },
  { id: '2', _id: 'ORD002B3X8', customer: 'Arun Menon', email: 'arun@email.com', total: 899, status: 'shipped', createdAt: '2026-05-30', items: [{ name: 'Extra Virgin Oil', quantity: 1, price: 899 }], shippingAddress: { fullName: 'Arun Menon', address: '5 Rose Avenue', city: 'Coimbatore', pincode: '641001' }, tracking: { carrier: 'DTDC', trackingId: 'DTDC98765' } },
  { id: '3', _id: 'ORD003C5N2', customer: 'Lakshmi Ravi', email: 'lakshmi@email.com', total: 699, status: 'processing', createdAt: '2026-06-01', items: [{ name: 'Hair & Skin Oil', quantity: 1, price: 699 }], shippingAddress: { fullName: 'Lakshmi Ravi', address: '33 MG Road', city: 'Pollachi', pincode: '642001' }, tracking: { carrier: 'BlueDart', trackingId: 'BD54321' } },
];

const AdminOrders = () => {
  const [search, setSearch] = useState('');
  const [allOrders, setAllOrders] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [status, setStatus] = useState('pending');
  const [carrier, setCarrier] = useState('BlueDart');
  const [trackingId, setTrackingId] = useState('');
  const [estimatedDelivery, setEstimatedDelivery] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const { addToast } = useToast();

  useEffect(() => { loadOrders(); }, []);

  const loadOrders = async () => {
    try {
      const { data } = await api.get('/orders');
      if (data?.length) {
        setAllOrders(data.map(o => ({
          ...o,
          id: o._id,
          customer: o.shippingAddress?.fullName || o.user?.name || 'Guest',
          email: o.shippingAddress?.email || o.user?.email || '—',
        })));
      } else {
        setAllOrders(defaultOrders);
      }
    } catch {
      const local = JSON.parse(localStorage.getItem('purecoco_orders') || '[]');
      const combined = [
        ...local.map(o => ({
          ...o,
          id: o._id,
          customer: o.shippingAddress?.fullName || o.shipping?.fullName || 'Guest',
          email: o.shippingAddress?.email || '—',
        })),
        ...defaultOrders,
      ];
      const seen = new Set();
      setAllOrders(combined.filter(o => { if (seen.has(o._id)) return false; seen.add(o._id); return true; }));
    }
  };

  const handleOpenStatusModal = (order) => {
    setSelectedOrder(order);
    setStatus(order.status || 'pending');
    setCarrier(order.tracking?.carrier || 'BlueDart');
    setTrackingId(order.tracking?.trackingId || '');
    setEstimatedDelivery(
      order.tracking?.estimatedDelivery
        ? new Date(order.tracking.estimatedDelivery).toISOString().split('T')[0]
        : new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0]
    );
    setModalOpen(true);
  };

  const handleViewDetail = (order) => {
    setSelectedOrder(order);
    setDetailModalOpen(true);
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      status,
      tracking: { carrier, trackingId, estimatedDelivery: new Date(estimatedDelivery).toISOString() },
    };
    try {
      await api.put(`/orders/${selectedOrder._id}/status`, payload);
      addToast(`Order #${selectedOrder._id.slice(-8).toUpperCase()} updated to "${status}"`, 'success');
    } catch {
      addToast(`Status updated locally (offline mode)`, 'info');
    }
    // Always update local state
    setAllOrders(prev => prev.map(o => o._id === selectedOrder._id ? { ...o, ...payload } : o));
    const local = JSON.parse(localStorage.getItem('purecoco_orders') || '[]');
    localStorage.setItem('purecoco_orders', JSON.stringify(
      local.map(o => o._id === selectedOrder._id ? { ...o, ...payload } : o)
    ));
    setModalOpen(false);
    setLoading(false);
  };

  const handleDelete = async (order) => {
    if (!window.confirm(`Delete order #${order._id.slice(-8).toUpperCase()}? This cannot be undone.`)) return;
    try {
      await api.delete(`/orders/${order._id}`);
      addToast('Order deleted', 'success');
    } catch {
      addToast('Order removed (offline mode)', 'info');
    }
    setAllOrders(prev => prev.filter(o => o._id !== order._id));
    const local = JSON.parse(localStorage.getItem('purecoco_orders') || '[]');
    localStorage.setItem('purecoco_orders', JSON.stringify(local.filter(o => o._id !== order._id)));
  };

  const filteredOrders = allOrders.filter(o => {
    const matchSearch = o.customer?.toLowerCase().includes(search.toLowerCase()) || o._id?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const columns = [
    { key: 'orderId', label: 'Order ID', render: row => <span className="font-mono text-xs font-bold">#{row._id?.slice(-8).toUpperCase()}</span> },
    { key: 'customer', label: 'Customer', render: row => (
      <div>
        <p className="font-sans font-semibold text-body text-sm">{row.customer}</p>
        <p className="text-xs text-muted">{row.email}</p>
      </div>
    )},
    { key: 'total', label: 'Total', render: row => <span className="font-semibold">{formatCurrency(row.total)}</span> },
    {
      key: 'payment',
      label: 'Payment',
      render: row => (
        <div>
          <Badge variant={paymentVariant[row.paymentStatus] || 'default'}>{row.paymentStatus || 'pending'}</Badge>
          <p className="text-[10px] text-muted mt-0.5 uppercase">{row.paymentMethod || 'cod'}</p>
        </div>
      )
    },
    { key: 'date', label: 'Date', render: row => <span className="text-sm text-muted">{formatDate(row.createdAt)}</span> },
    { key: 'status', label: 'Status', render: row => <Badge variant={statusVariant[row.status] || 'default'}>{row.status}</Badge> },
    {
      key: 'availability',
      label: 'Delivery Pref.',
      render: row => {
        if (!row.deliveryAvailability || row.deliveryAvailability === 'pending') return <span className="text-muted text-xs">—</span>;
        const labels = { available: 'At Home', neighbor: 'Neighbor', doorstep: 'Doorstep', reschedule: 'Rescheduled' };
        const variants = { available: 'success', neighbor: 'gold', doorstep: 'default', reschedule: 'danger' };
        return (
          <div>
            <Badge variant={variants[row.deliveryAvailability]}>{labels[row.deliveryAvailability]}</Badge>
            {row.deliveryNotes && <p className="text-[10px] text-muted mt-0.5 max-w-[120px] truncate" title={row.deliveryNotes}>{row.deliveryNotes}</p>}
          </div>
        );
      }
    },
    {
      key: 'action',
      label: 'Actions',
      render: row => (
        <div className="flex items-center gap-1">
          <button onClick={() => handleViewDetail(row)} className="p-1.5 rounded hover:bg-gold/10 text-gold transition-colors" title="View Order Details">
            <Eye size={15} />
          </button>
          <Link to={`/track/${row._id}`} className="p-1.5 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-500 transition-colors" title="Track Order" target="_blank">
            <span className="text-xs font-bold">📍</span>
          </Link>
          <button onClick={() => handleOpenStatusModal(row)} className="p-1.5 rounded hover:bg-gold/10 text-gold transition-colors" title="Update Status">
            <Edit size={15} />
          </button>
          <button onClick={() => handleDelete(row)} className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors" title="Delete Order">
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  // Summary stats
  const total = allOrders.length;
  const delivered = allOrders.filter(o => o.status === 'delivered').length;
  const outForDelivery = allOrders.filter(o => o.status === 'out-for-delivery').length;
  const revenue = allOrders.reduce((s, o) => s + (o.total || 0), 0);

  return (
    <AdminLayout title="Orders" subtitle="Track and manage all customer orders">

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Orders', value: total, color: 'text-gold' },
          { label: 'Delivered', value: delivered, color: 'text-natural' },
          { label: 'Out for Delivery', value: outForDelivery, color: 'text-blue-500' },
          { label: 'Total Revenue', value: formatCurrency(revenue), color: 'text-gold' },
        ].map(s => (
          <div key={s.label} className="p-4 card text-center">
            <p className={`text-2xl font-bold font-display ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Status Filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        {['all', 'pending', 'processing', 'shipped', 'out-for-delivery', 'delivered', 'cancelled'].map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-sans font-semibold capitalize transition-colors ${
              statusFilter === s
                ? 'bg-gold text-white'
                : 'bg-coconut/10 dark:bg-cream/10 text-coconut dark:text-cream hover:bg-gold/20'
            }`}
          >
            {s === 'all' ? 'All Orders' : s}
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={filteredOrders}
        searchPlaceholder="Search by customer or order ID..."
        onSearch={setSearch}
      />

      {/* Update Status Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Update Order Status & Tracking" size="md">
        {selectedOrder && (
          <form onSubmit={handleUpdateStatus} className="space-y-4">
            <div className="p-3 bg-coconut/5 dark:bg-cream/5 rounded-lg text-sm">
              <span className="text-muted">Order: </span>
              <span className="font-mono font-bold">#{selectedOrder._id?.slice(-8).toUpperCase()}</span>
              <span className="text-muted ml-3">Customer: </span>
              <span className="font-semibold">{selectedOrder.customer}</span>
            </div>

            <div>
              <label className="block text-sm font-sans font-medium text-body mb-1.5">Order Status</label>
              <select
                className="w-full px-4 py-2.5 rounded-lg font-sans bg-white dark:bg-coconut-light/30 border-2 border-coconut/20 dark:border-cream/20 text-coconut dark:text-cream focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
                value={status}
                onChange={e => setStatus(e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="out-for-delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <Input label="Courier Carrier" required value={carrier} onChange={e => setCarrier(e.target.value)} placeholder="e.g. BlueDart, DTDC" />
            <Input label="Tracking ID" required value={trackingId} onChange={e => setTrackingId(e.target.value)} placeholder="e.g. BD123456789" />
            <Input label="Estimated Delivery Date" type="date" required value={estimatedDelivery} onChange={e => setEstimatedDelivery(e.target.value)} />

            {status === 'out-for-delivery' && (
              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800 text-xs text-amber-700 dark:text-amber-300">
                📍 Setting to "Out for Delivery" will activate the Live Map Tracking module for the customer.
              </div>
            )}

            <div className="flex justify-end gap-3 border-t border-coconut/10 dark:border-cream/10 pt-4">
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button type="submit" variant="secondary" loading={loading}>Save Changes</Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Order Detail Modal */}
      <Modal isOpen={detailModalOpen} onClose={() => setDetailModalOpen(false)} title="Order Details" size="lg">
        {selectedOrder && (
          <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-1">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-coconut/5 dark:bg-cream/5 rounded-lg">
                <span className="text-muted text-xs block mb-1">Order ID</span>
                <span className="font-mono font-bold">#{selectedOrder._id?.slice(-8).toUpperCase()}</span>
              </div>
              <div className="p-3 bg-coconut/5 dark:bg-cream/5 rounded-lg">
                <span className="text-muted text-xs block mb-1">Status</span>
                <Badge variant={statusVariant[selectedOrder.status] || 'default'}>{selectedOrder.status}</Badge>
              </div>
              <div className="p-3 bg-coconut/5 dark:bg-cream/5 rounded-lg">
                <span className="text-muted text-xs block mb-1">Payment</span>
                <Badge variant={paymentVariant[selectedOrder.paymentStatus] || 'default'}>{selectedOrder.paymentStatus || 'pending'}</Badge>
                <p className="text-[10px] text-muted mt-1 uppercase">{selectedOrder.paymentMethod || 'cod'}</p>
              </div>
              <div className="p-3 bg-coconut/5 dark:bg-cream/5 rounded-lg">
                <span className="text-muted text-xs block mb-1">Customer</span>
                <span className="font-semibold">{selectedOrder.customer}</span>
              </div>
              <div className="p-3 bg-coconut/5 dark:bg-cream/5 rounded-lg">
                <span className="text-muted text-xs block mb-1">Order Date</span>
                <span className="font-semibold">{formatDate(selectedOrder.createdAt)}</span>
              </div>
            </div>

            {selectedOrder.shippingAddress && (
              <div className="p-4 border border-coconut/10 dark:border-cream/10 rounded-xl">
                <h4 className="font-display font-semibold text-body text-sm mb-2">Shipping Address</h4>
                <p className="text-sm text-muted">{selectedOrder.shippingAddress.fullName}</p>
                <p className="text-sm text-muted">{selectedOrder.shippingAddress.address}</p>
                <p className="text-sm text-muted">{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.pincode}</p>
              </div>
            )}

            {selectedOrder.items?.length > 0 && (
              <div>
                <h4 className="font-display font-semibold text-body text-sm mb-3">Items Ordered</h4>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-coconut/5 dark:bg-cream/5 rounded-lg text-sm">
                      <span className="font-medium">{item.name} × {item.quantity}</span>
                      <span className="font-bold">{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between items-center pt-3 border-t border-coconut/10 dark:border-cream/10 font-bold">
              <span>Total</span>
              <span className="text-gold text-lg">{formatCurrency(selectedOrder.total)}</span>
            </div>

            {selectedOrder.tracking && (
              <div className="p-4 border border-coconut/10 dark:border-cream/10 rounded-xl">
                <h4 className="font-display font-semibold text-body text-sm mb-2">Tracking Info</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><span className="text-muted">Carrier:</span> <span className="font-semibold">{selectedOrder.tracking.carrier}</span></div>
                  <div><span className="text-muted">ID:</span> <span className="font-mono font-bold">{selectedOrder.tracking.trackingId}</span></div>
                </div>
              </div>
            )}

            {selectedOrder.deliveryAvailability && selectedOrder.deliveryAvailability !== 'pending' && (
              <div className="p-4 bg-natural/10 border border-natural/20 rounded-xl">
                <h4 className="font-display font-semibold text-natural text-sm mb-1">Customer Delivery Preference</h4>
                <p className="text-sm font-semibold capitalize">{selectedOrder.deliveryAvailability}</p>
                {selectedOrder.deliveryNotes && <p className="text-xs text-muted mt-1">{selectedOrder.deliveryNotes}</p>}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Link to={`/track/${selectedOrder._id}`} target="_blank">
                <Button variant="secondary" size="sm">📍 View Tracking Page</Button>
              </Link>
              <Button variant="outline" size="sm" onClick={() => { setDetailModalOpen(false); handleOpenStatusModal(selectedOrder); }}>
                Update Status
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
};

export default AdminOrders;
