import { useState, useEffect } from 'react';
import { Trash2, Mail, Clock } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import DataTable from '../../components/admin/DataTable';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { useToast } from '../../components/common/Toast';
import { formatDate } from '../../utils/formatCurrency';
import api from '../../services/api';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    loadMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const response = await api.get('/messages');
      setMessages(response.data || []);
    } catch (error) {
      console.error('Failed to load messages:', error);
      addToast('Failed to load messages', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    
    try {
      await api.delete(`/messages/${id}`);
      setMessages(messages.filter(m => m._id !== id));
      addToast('Message deleted successfully', 'success');
    } catch (error) {
      console.error('Failed to delete message:', error);
      addToast('Failed to delete message', 'error');
    }
  };

  const handleViewDetails = (message) => {
    // Mark as read
    if (!message.isRead) {
      api.get(`/messages/${message._id}`).catch(console.error);
      setMessages(messages.map(m =>
        m._id === message._id ? { ...m, isRead: true, status: m.status === 'new' ? 'read' : m.status } : m
      ));
      message = { ...message, isRead: true, status: message.status === 'new' ? 'read' : message.status };
    }
    setSelectedMessage(message);
    setShowModal(true);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.patch(`/messages/${id}`, { status: newStatus });
      setMessages(messages.map(m => 
        m._id === id ? { ...m, status: newStatus } : m
      ));
      if (selectedMessage?._id === id) {
        setSelectedMessage({ ...selectedMessage, status: newStatus });
      }
      addToast('Message status updated', 'success');
    } catch (error) {
      console.error('Failed to update message:', error);
      addToast('Failed to update message', 'error');
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'From',
      render: (row) => (
        <div className="text-sm">
          <p className="font-semibold">{row.name}</p>
          <p className="text-muted text-xs">{row.email}</p>
        </div>
      ),
    },
    {
      key: 'message',
      label: 'Message',
      render: (row) => (
        <span className="text-sm text-ellipsis line-clamp-2">
          {row.message}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <Badge variant={row.status === 'new' ? 'warning' : row.status === 'replied' ? 'success' : 'default'}>
          {row.status || 'new'}
        </Badge>
      ),
    },
    {
      key: 'read',
      label: 'Read',
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
          <button
            onClick={() => handleViewDetails(row)}
            className="p-1.5 rounded hover:bg-gold/10 text-gold transition-colors"
            title="View message"
          >
            <Mail size={16} />
          </button>
          <button
            onClick={() => handleDelete(row._id)}
            className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 transition-colors"
            title="Delete message"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout title="Customer Messages" subtitle="Manage customer inquiries and support messages">
      <div className="card">
        {loading ? (
          <div className="p-8 text-center">
            <p className="text-muted">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-muted">No messages yet</p>
          </div>
        ) : (
          <DataTable columns={columns} data={messages} />
        )}
      </div>

      {/* Message Details Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        {selectedMessage && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-coconut dark:text-cream">
              Message Details
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted mb-1">From</p>
                <p className="font-semibold">{selectedMessage.name}</p>
              </div>
              <div>
                <p className="text-xs text-muted mb-1">Email</p>
                <p className="text-sm">{selectedMessage.email}</p>
              </div>
              <div>
                <p className="text-xs text-muted mb-1">Status</p>
                <Badge variant={selectedMessage.status === 'new' ? 'warning' : selectedMessage.status === 'replied' ? 'success' : 'default'}>
                  {selectedMessage.status || 'new'}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-muted mb-1">Date</p>
                <p className="text-sm flex items-center gap-1">
                  <Clock size={14} />
                  {formatDate(selectedMessage.createdAt)}
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs text-muted mb-2">Message</p>
              <div className="p-4 bg-coconut/5 dark:bg-cream/5 rounded text-sm leading-relaxed">
                {selectedMessage.message}
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                variant="secondary"
                onClick={() => setShowModal(false)}
              >
                Close
              </Button>
              {selectedMessage.status !== 'replied' && (
                <Button
                  onClick={() => handleStatusChange(selectedMessage._id, 'replied')}
                >
                  Mark as Replied
                </Button>
              )}
              <Button
                variant="danger"
                onClick={() => {
                  handleDelete(selectedMessage._id);
                  setShowModal(false);
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
};

export default AdminMessages;
