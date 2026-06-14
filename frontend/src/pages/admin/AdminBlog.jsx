import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, ExternalLink } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import DataTable from '../../components/admin/DataTable';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { useToast } from '../../components/common/Toast';
import { formatDate } from '../../utils/formatCurrency';
import productService from '../../services/productService';

const initialFormData = {
  title: '',
  excerpt: '',
  content: '',
  image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80',
  author: 'PureCoco Team',
  category: 'Wellness',
  readTime: '5 min',
};

const AdminBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null); // null means adding
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    const data = await productService.getBlogs();
    setBlogs(data.blogs || []);
  };

  const handleOpenAddModal = () => {
    setEditingBlog(null);
    setFormData(initialFormData);
    setModalOpen(true);
  };

  const handleOpenEditModal = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content || '',
      image: blog.image || 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80',
      author: blog.author || 'PureCoco Team',
      category: blog.category || 'Wellness',
      readTime: blog.readTime || '5 min',
    });
    setModalOpen(true);
  };

  const handleDelete = async (slug, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await productService.deleteBlog(slug);
        addToast(`"${title}" deleted`, 'success');
        loadBlogs();
      } catch (error) {
        addToast(`Failed to delete "${title}"`, 'error');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingBlog) {
        await productService.updateBlog(editingBlog.slug, formData);
        addToast(`"${formData.title}" updated successfully`, 'success');
      } else {
        await productService.createBlog(formData);
        addToast(`"${formData.title}" created successfully`, 'success');
      }
      setModalOpen(false);
      loadBlogs();
    } catch (error) {
      console.error(error);
      addToast(error.response?.data?.message || 'Failed to save article', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filtered = blogs.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      key: 'title',
      label: 'Article',
      render: (row) => (
        <div className="flex items-center gap-3">
          <img src={row.image} alt="" className="w-12 h-8 rounded object-cover" />
          <span className="font-sans font-medium text-body">{row.title}</span>
        </div>
      ),
    },
    { key: 'category', label: 'Category', render: (row) => <Badge variant="gold">{row.category}</Badge> },
    { key: 'author', label: 'Author', render: (row) => <span className="text-muted">{row.author}</span> },
    { key: 'date', label: 'Published', render: (row) => formatDate(row.createdAt || row.date) },
    { key: 'readTime', label: 'Read Time' },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <Link to={`/blog/${row.slug}`} className="p-1.5 rounded hover:bg-gold/10 text-gold" aria-label="View">
            <ExternalLink size={16} />
          </Link>
          <button className="p-1.5 rounded hover:bg-gold/10 text-gold" onClick={() => handleOpenEditModal(row)} aria-label="Edit">
            <Edit size={16} />
          </button>
          <button className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500" onClick={() => handleDelete(row.slug, row.title)} aria-label="Delete">
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout title="Blog" subtitle="Manage articles and harvest stories">
      <div className="flex justify-between items-center mb-6">
        <p className="text-muted text-sm font-sans">{filtered.length} articles</p>
        <Button variant="secondary" icon={Plus} onClick={handleOpenAddModal}>
          New Article
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={filtered.map((b) => ({ ...b, id: b._id || b.slug }))}
        searchPlaceholder="Search articles..."
        onSearch={setSearch}
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingBlog ? 'Edit Article' : 'Write New Article'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Article Title"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Author Name"
              required
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            />
            <Input
              label="Category"
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            />
            <Input
              label="Read Time (e.g. 5 min)"
              required
              value={formData.readTime}
              onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
            />
          </div>

          <Input
            label="Header Image URL"
            required
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          />

          <Input
            label="Short Excerpt"
            required
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
          />

          <div className="w-full">
            <label className="block text-sm font-sans font-medium text-body mb-1.5">Full Content</label>
            <textarea
              className="w-full px-4 py-2.5 rounded-lg font-sans bg-white dark:bg-coconut-light/30 border-2 border-coconut/20 dark:border-cream/20 text-coconut dark:text-cream focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
              rows={6}
              required
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-coconut/10 dark:border-cream/10 pt-4">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="secondary" loading={loading}>
              {editingBlog ? 'Save Changes' : 'Publish Article'}
            </Button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
};

export default AdminBlog;
