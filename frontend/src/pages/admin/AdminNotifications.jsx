import { useState, useEffect } from 'react';
import { Trash2, Bell, Send } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import DataTable from '../../components/admin/DataTable';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { useToast } from '../../components/common/Toast';
import { formatDate } from '../../utils/formatCurrency';
import api from '../../services/api';

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    type: 'announcement',
    title: '',
    message: '',
  });
  const { addToast } = useToast();

  useEffect(() => {
    loadNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await api.get('/notifications');
      setNotifications(response.data || []);
    } catch (error) {
      console.error('Failed to load notifications:', error);
      addToast('Failed to load notifications', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this notification?')) return;
    
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(notifications.filter(n => n._id !== id));
      addToast('Notification deleted successfully', 'success');
    } catch (error) {
      console.error('Failed to delete notification:', error);
      addToast('Failed to delete notification', 'error');
    }
  };

  const handleCreateNotification = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.message) {
      addToast('Title and message are required', 'error');
      return;
    }

    try {
      setCreating(true);
      const response = await api.post('/notifications', {
        type: formData.type,
        title: formData.title,
        message: formData.message,
        sendEmail: false,
      });
      setNotifications([response.data, ...notifications]);
      setFormData({ type: 'announcement', title: '', message: '' });
      setShowCreateModal(false);
      addToast('Notification created successfully', 'success');
    } catch (error) {
      console.error('Failed to create notification:', error);
      addToast('Failed to create notification', 'error');
    } finally {
      setCreating(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(notifications.map(n =>
        n._id === id ? { ...n, isRead: true } : n
      ));
      addToast('Notification marked as read', 'success');
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const columns = [
    {
      key: 'type',
      label: 'Type',
      render: (row) => (
        <Badge variant={
          row.type === 'order' ? 'natural' :
          row.type === 'announcement' ? 'gold' :
          row.type === 'alert' ? 'danger' :
          'default'
        }>
          {row.type}
        </Badge>
      ),
    },
    {
      key: 'title',
      label: 'Title',
      render: (row) => <span className="font-semibold">{row.title}</span>,
    },
    {
      key: 'message',
      label: 'Message',
      render: (row) => (
        <span className="text-sm text-ellipsis line-clamp-1">
          {row.message}
        </span>
      ),
    },
    {
      key: 'read',
      label: 'Status',
      render: (row) => (
        <Badge variant={row.isRead ? 'success' : 'warning'}>
          {row.isRead ? 'Read' : 'Unread'}
        </Badge>
      ),
    },
    {
      key: 'date',
      label: 'Date',
      render: (row) => <span className="text-xs text-muted">{formatDate(row.createdAt)}</span>,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          {!row.isRead && (
            <button
              onClick={() => handleMarkAsRead(row._id)}
              className="p-1.5 rounded hover:bg-gold/10 text-gold transition-colors text-xs"
              title="Mark as read"
            >
              Mark Read
            </button>
          )}
          <button
            onClick={() => handleDelete(row._id)}
            className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 transition-colors"
            title="Delete notification"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout title="Notifications" subtitle="System notifications and announcements">
      <div className="space-y-6">
        <div className="flex justify-end">
          <Button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2"
          >
            <Send size={16} />
            Create Notification
          </Button>
        </div>

        <div className="card">
          {loading ? (
            <div className="p-8 text-center">
              <p className="text-muted">Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell size={32} className="mx-auto text-coconut/30 dark:text-cream/30 mb-3" />
              <p className="text-muted">No notifications yet</p>
            </div>
          ) : (
            <DataTable columns={columns} data={notifications} />
          )}
        </div>
      </div>

      {/* Create Notification Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)}>
        <form onSubmit={handleCreateNotification} className="space-y-4">
          <h3 className="text-lg font-bold text-coconut dark:text-cream">
            Create Notification
          </h3>
          
          <div>
            <label className="block text-sm font-semibold mb-2">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3 py-2 border border-coconut/20 dark:border-cream/20 rounded-lg bg-white dark:bg-coconut-light/20"
            >
              <option value="announcement">Announcement</option>
              <option value="alert">Alert</option>
              <option value="order">Order Update</option>
              <option value="promotion">Promotion</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Title</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Notification title"
              disabled={creating}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Message</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Notification message"
              disabled={creating}
              rows={4}
              className="w-full px-3 py-2 border border-coconut/20 dark:border-cream/20 rounded-lg bg-white dark:bg-coconut-light/20 font-sans"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              variant="secondary"
              onClick={() => setShowCreateModal(false)}
              disabled={creating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={creating}
            >
              {creating ? 'Creating...' : 'Create Notification'}
            </Button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
};

export default AdminNotifications;
