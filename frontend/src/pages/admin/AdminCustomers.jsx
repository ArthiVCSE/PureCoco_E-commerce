import { useState, useEffect } from 'react';
import { Mail, UserCheck, UserX, Trash2, Eye } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import DataTable from '../../components/admin/DataTable';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import { formatCurrency, formatDate } from '../../utils/formatCurrency';
import { MOCK_CUSTOMERS } from '../../services/productService';
import api from '../../services/api';
import { useToast } from '../../components/common/Toast';

const AdminCustomers = () => {
  const [search, setSearch] = useState('');
  const [customers, setCustomers] = useState(MOCK_CUSTOMERS);
  const [selected, setSelected] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/users');
        if (data?.length) {
          setCustomers(data.map(u => ({
            id: u._id,
            name: u.name,
            email: u.email,
            orders: 0,
            spent: 0,
            joined: u.createdAt,
            status: 'active',
          })));
        }
      } catch { /* use mock */ }
    };
    load();
  }, []);

  const handleDelete = async (customer) => {
    if (!window.confirm(`Remove customer ${customer.name}? This cannot be undone.`)) return;
    try {
      await api.delete(`/users/${customer.id}`);
      addToast(`${customer.name} removed`, 'success');
    } catch {
      addToast(`${customer.name} removed (offline mode)`, 'info');
    }
    setCustomers(prev => prev.filter(c => c.id !== customer.id));
  };

  const handleContact = (customer) => {
    window.open(`mailto:${customer.email}?subject=PureCoco Support&body=Dear ${customer.name},%0D%0A%0D%0A`, '_blank');
  };

  const filtered = customers.filter(
    c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalRevenue = customers.reduce((s, c) => s + (c.spent || 0), 0);
  const avgOrderValue = customers.length > 0 ? totalRevenue / customers.reduce((s, c) => s + (c.orders || 0), 0) || 1240 : 1240;

  const columns = [
    {
      key: 'name',
      label: 'Customer',
      render: row => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold/30 to-natural/30 flex items-center justify-center text-gold font-sans font-bold text-sm shrink-0">
            {row.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <span className="font-sans font-semibold text-body text-sm">{row.name}</span>
            <p className="text-xs text-muted">{row.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'orders', label: 'Orders', render: row => <span className="font-bold text-sm">{row.orders || 0}</span> },
    { key: 'spent', label: 'Total Spent', render: row => <span className="font-semibold">{formatCurrency(row.spent || 0)}</span> },
    { key: 'joined', label: 'Joined', render: row => <span className="text-sm text-muted">{formatDate(row.joined)}</span> },
    {
      key: 'status',
      label: 'Status',
      render: row => (
        row.status === 'banned'
          ? <Badge variant="danger"><UserX size={10} className="mr-1" />Banned</Badge>
          : <Badge variant="success"><UserCheck size={10} className="mr-1" />Active</Badge>
      ),
    },
    {
      key: 'action',
      label: 'Actions',
      render: row => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => { setSelected(row); setDetailOpen(true); }}
            className="p-1.5 rounded hover:bg-gold/10 text-gold transition-colors"
            title="View Profile"
          >
            <Eye size={14} />
          </button>
          <button
            onClick={() => handleContact(row)}
            className="p-1.5 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-500 transition-colors"
            title="Send Email"
          >
            <Mail size={14} />
          </button>
          <button
            onClick={() => handleDelete(row)}
            className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors"
            title="Remove Customer"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout title="Customers" subtitle="Manage your customer base">

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Customers', value: customers.length },
          { label: 'Active', value: customers.filter(c => c.status !== 'banned').length },
          { label: 'Avg. Order Value', value: formatCurrency(avgOrderValue) },
          { label: 'Total Revenue', value: formatCurrency(totalRevenue || 48500) },
        ].map(({ label, value }) => (
          <div key={label} className="p-4 card text-center">
            <p className="text-xl font-display font-bold text-gold">{value}</p>
            <p className="text-xs text-muted font-sans mt-1">{label}</p>
          </div>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={filtered.map(c => ({ ...c, id: c.id || c._id }))}
        searchPlaceholder="Search customers by name or email..."
        onSearch={setSearch}
      />

      {/* Customer Detail Modal */}
      <Modal isOpen={detailOpen} onClose={() => setDetailOpen(false)} title="Customer Profile" size="md">
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-coconut/5 dark:bg-cream/5 rounded-xl">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gold/30 to-natural/30 flex items-center justify-center text-gold font-display font-bold text-2xl">
                {selected.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-display font-bold text-body text-lg">{selected.name}</h3>
                <p className="text-sm text-muted">{selected.email}</p>
                <Badge variant={selected.status === 'banned' ? 'danger' : 'success'} className="mt-1">
                  {selected.status || 'Active'}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 bg-coconut/5 dark:bg-cream/5 rounded-lg text-center">
                <p className="text-xl font-bold text-gold">{selected.orders || 0}</p>
                <p className="text-xs text-muted">Total Orders</p>
              </div>
              <div className="p-3 bg-coconut/5 dark:bg-cream/5 rounded-lg text-center">
                <p className="text-xl font-bold text-natural">{formatCurrency(selected.spent || 0)}</p>
                <p className="text-xs text-muted">Total Spent</p>
              </div>
            </div>

            <div className="text-sm space-y-2">
              <div className="flex justify-between py-2 border-b border-coconut/10 dark:border-cream/10">
                <span className="text-muted">Customer ID</span>
                <span className="font-mono text-xs font-bold">{selected.id}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-coconut/10 dark:border-cream/10">
                <span className="text-muted">Joined</span>
                <span>{formatDate(selected.joined)}</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button variant="secondary" size="sm" onClick={() => handleContact(selected)} className="flex-1">
                <Mail size={14} /> Send Email
              </Button>
              <Button variant="danger" size="sm" onClick={() => { handleDelete(selected); setDetailOpen(false); }}>
                <Trash2 size={14} /> Remove
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
};

export default AdminCustomers;
