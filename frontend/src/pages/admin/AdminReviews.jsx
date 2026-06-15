import { useState, useEffect } from 'react';
import { Trash2, Star, Eye } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import DataTable from '../../components/admin/DataTable';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { useToast } from '../../components/common/Toast';
import { formatDate } from '../../utils/formatCurrency';
import api from '../../services/api';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    loadReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const response = await api.get('/reviews');
      setReviews(response.data || []);
    } catch (error) {
      console.error('Failed to load reviews:', error);
      addToast('Failed to load reviews', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    
    try {
      await api.delete(`/reviews/${id}`);
      setReviews(reviews.filter(r => r._id !== id));
      addToast('Review deleted successfully', 'success');
    } catch (error) {
      console.error('Failed to delete review:', error);
      addToast('Failed to delete review', 'error');
    }
  };

  const handleViewDetails = (review) => {
    setSelectedReview(review);
    setShowModal(true);
  };

  const columns = [
    {
      key: 'product',
      label: 'Product',
      render: (row) => (
        <span className="font-semibold text-sm">
          {row.product?.name || 'Unknown Product'}
        </span>
      ),
    },
    {
      key: 'user',
      label: 'Reviewer',
      render: (row) => (
        <div className="text-sm">
          <p className="font-semibold">{row.user?.name || 'Anonymous'}</p>
          <p className="text-muted text-xs">{row.user?.email}</p>
        </div>
      ),
    },
    {
      key: 'rating',
      label: 'Rating',
      render: (row) => (
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={14}
              className={i < row.rating ? 'fill-gold text-gold' : 'text-coconut/30'}
            />
          ))}
          <span className="text-xs ml-2 font-semibold">{row.rating}/5</span>
        </div>
      ),
    },
    {
      key: 'verified',
      label: 'Verified',
      render: (row) => (
        <Badge variant={row.isVerified ? 'success' : 'default'}>
          {row.isVerified ? 'Verified Purchase' : 'Unverified'}
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
            title="View details"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => handleDelete(row._id)}
            className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 transition-colors"
            title="Delete review"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout title="Customer Reviews" subtitle="Manage and moderate product reviews">
      <div className="card">
        {loading ? (
          <div className="p-8 text-center">
            <p className="text-muted">Loading reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-muted">No reviews yet</p>
          </div>
        ) : (
          <DataTable columns={columns} data={reviews} />
        )}
      </div>

      {/* Review Details Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        {selectedReview && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-coconut dark:text-cream">
              Review Details
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted mb-1">Product</p>
                <p className="font-semibold">{selectedReview.product?.name}</p>
              </div>
              <div>
                <p className="text-xs text-muted mb-1">Reviewer</p>
                <p className="font-semibold">{selectedReview.user?.name}</p>
              </div>
              <div>
                <p className="text-xs text-muted mb-1">Email</p>
                <p className="text-sm">{selectedReview.user?.email}</p>
              </div>
              <div>
                <p className="text-xs text-muted mb-1">Rating</p>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < selectedReview.rating ? 'fill-gold text-gold' : 'text-coconut/30'}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs text-muted mb-2">Review Text</p>
              <p className="text-sm leading-relaxed">{selectedReview.text}</p>
            </div>

            {selectedReview.images && selectedReview.images.length > 0 && (
              <div>
                <p className="text-xs text-muted mb-2">Review Images</p>
                <div className="grid grid-cols-2 gap-2">
                  {selectedReview.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Review ${idx + 1}`}
                      className="w-full h-24 object-cover rounded"
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button
                variant="secondary"
                onClick={() => setShowModal(false)}
              >
                Close
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  handleDelete(selectedReview._id);
                  setShowModal(false);
                }}
              >
                Delete Review
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
};

export default AdminReviews;
