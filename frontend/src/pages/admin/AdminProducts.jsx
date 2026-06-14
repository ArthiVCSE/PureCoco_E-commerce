import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import DataTable from '../../components/admin/DataTable';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { useToast } from '../../components/common/Toast';
import { formatCurrency } from '../../utils/formatCurrency';
import productService from '../../services/productService';

const initialFormData = {
  name: '',
  price: '',
  originalPrice: '',
  size: '',
  category: 'cooking',
  stock: '',
  purityScore: '95',
  lauricAcid: '48.0',
  moisture: '0.05',
  ffa: '0.08',
  peroxide: '0.5',
  batchId: '',
  harvestDate: '',
  farmName: 'Green Valley Estate',
  farmLocation: 'Pollachi, Tamil Nadu',
  farmFarmer: 'Rajan Kumar',
  tags: 'organic, pure',
  usage: 'cooking, wellness',
  image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&q=80',
  description: '',
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null means adding
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const data = await productService.getAll();
    setProducts(data.products || []);
  };

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData(initialFormData);
    setModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice || '',
      size: product.size,
      category: product.category || 'cooking',
      stock: product.stock,
      purityScore: product.purityScore || '95',
      lauricAcid: product.purityMetrics?.lauricAcid || '48.0',
      moisture: product.purityMetrics?.moisture || '0.05',
      ffa: product.purityMetrics?.ffa || '0.08',
      peroxide: product.purityMetrics?.peroxide || '0.5',
      batchId: product.batchId || '',
      harvestDate: product.harvestDate ? new Date(product.harvestDate).toISOString().split('T')[0] : '',
      farmName: product.farm?.name || 'Green Valley Estate',
      farmLocation: product.farm?.location || 'Pollachi, Tamil Nadu',
      farmFarmer: product.farm?.farmer || 'Rajan Kumar',
      tags: product.tags?.join(', ') || 'organic, pure',
      usage: product.usage?.join(', ') || 'cooking, wellness',
      image: product.images?.[0] || 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&q=80',
      description: product.description || '',
    });
    setModalOpen(true);
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await productService.deleteProduct(id);
        addToast(`${name} removed`, 'success');
        loadProducts();
      } catch (error) {
        addToast(`Failed to delete ${name}`, 'error');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
        description: formData.description,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
        size: formData.size,
        category: formData.category,
        stock: Number(formData.stock),
        inStock: Number(formData.stock) > 0,
        purityScore: Number(formData.purityScore),
        purityMetrics: {
          lauricAcid: Number(formData.lauricAcid),
          moisture: Number(formData.moisture),
          ffa: Number(formData.ffa),
          peroxide: Number(formData.peroxide),
        },
        batchId: formData.batchId || `PC-2026-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        harvestDate: formData.harvestDate ? new Date(formData.harvestDate) : new Date(),
        farm: {
          name: formData.farmName,
          location: formData.farmLocation,
          farmer: formData.farmFarmer,
        },
        tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
        usage: formData.usage.split(',').map((u) => u.trim()).filter(Boolean),
        images: [formData.image],
      };

      if (editingProduct) {
        await productService.updateProduct(editingProduct._id, payload);
        addToast(`${formData.name} updated successfully`, 'success');
      } else {
        await productService.createProduct(payload);
        addToast(`${formData.name} created successfully`, 'success');
      }

      setModalOpen(false);
      loadProducts();
    } catch (error) {
      console.error(error);
      addToast(error.response?.data?.message || 'Failed to save product', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      key: 'name',
      label: 'Product',
      render: (row) => (
        <div className="flex items-center gap-3">
          <img src={row.images?.[0] || 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=100&q=80'} alt="" className="w-10 h-10 rounded-lg object-cover" />
          <span className="font-sans font-medium text-body">{row.name}</span>
        </div>
      ),
    },
    { key: 'size', label: 'Size' },
    { key: 'price', label: 'Price', render: (row) => formatCurrency(row.price) },
    { key: 'stock', label: 'Stock' },
    { key: 'purityScore', label: 'Purity', render: (row) => <Badge variant="natural">{row.purityScore || 95}%</Badge> },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <button className="p-1.5 rounded hover:bg-gold/10 text-gold" onClick={() => handleOpenEditModal(row)} aria-label="Edit">
            <Edit size={16} />
          </button>
          <button className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500" onClick={() => handleDelete(row._id, row.name)} aria-label="Delete">
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout title="Products" subtitle="Manage your product catalog">
      <div className="flex justify-between items-center mb-6">
        <p className="text-muted text-sm font-sans">{filtered.length} products</p>
        <Button variant="secondary" icon={Plus} onClick={handleOpenAddModal}>
          Add Product
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={filtered.map((p) => ({ ...p, id: p._id }))}
        searchPlaceholder="Search products..."
        onSearch={setSearch}
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Product Name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <div className="w-full">
              <label className="block text-sm font-sans font-medium text-body mb-1.5">Category</label>
              <select
                className="w-full px-4 py-2.5 rounded-lg font-sans bg-white dark:bg-coconut-light/30 border-2 border-coconut/20 dark:border-cream/20 text-coconut dark:text-cream focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="cooking">Cooking</option>
                <option value="beauty">Beauty</option>
                <option value="wellness">Wellness</option>
              </select>
            </div>
            <Input
              label="Price (₹)"
              type="number"
              required
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />
            <Input
              label="Original Price (₹ - Optional)"
              type="number"
              value={formData.originalPrice}
              onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
            />
            <Input
              label="Size (e.g. 500ml, 1L)"
              required
              value={formData.size}
              onChange={(e) => setFormData({ ...formData, size: e.target.value })}
            />
            <Input
              label="Stock Quantity"
              type="number"
              required
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            />
            <Input
              label="Purity Score (%)"
              type="number"
              required
              value={formData.purityScore}
              onChange={(e) => setFormData({ ...formData, purityScore: e.target.value })}
            />
            <Input
              label="Image URL"
              required
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            />
          </div>

          <div className="border-t border-coconut/10 dark:border-cream/10 pt-4 mt-2">
            <h3 className="font-sans font-semibold text-coconut dark:text-cream mb-2 text-sm">Purity Metrics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Input
                label="Lauric Acid (%)"
                type="number"
                step="0.1"
                value={formData.lauricAcid}
                onChange={(e) => setFormData({ ...formData, lauricAcid: e.target.value })}
              />
              <Input
                label="Moisture (%)"
                type="number"
                step="0.01"
                value={formData.moisture}
                onChange={(e) => setFormData({ ...formData, moisture: e.target.value })}
              />
              <Input
                label="FFA (%)"
                type="number"
                step="0.01"
                value={formData.ffa}
                onChange={(e) => setFormData({ ...formData, ffa: e.target.value })}
              />
              <Input
                label="Peroxide (meq/kg)"
                type="number"
                step="0.1"
                value={formData.peroxide}
                onChange={(e) => setFormData({ ...formData, peroxide: e.target.value })}
              />
            </div>
          </div>

          <div className="border-t border-coconut/10 dark:border-cream/10 pt-4">
            <h3 className="font-sans font-semibold text-coconut dark:text-cream mb-2 text-sm">Traceability & Farm Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Batch ID (Optional)"
                placeholder="Auto-generated if blank"
                value={formData.batchId}
                onChange={(e) => setFormData({ ...formData, batchId: e.target.value })}
              />
              <Input
                label="Harvest Date"
                type="date"
                value={formData.harvestDate}
                onChange={(e) => setFormData({ ...formData, harvestDate: e.target.value })}
              />
              <Input
                label="Farm Name"
                value={formData.farmName}
                onChange={(e) => setFormData({ ...formData, farmName: e.target.value })}
              />
              <Input
                label="Farm Location"
                value={formData.farmLocation}
                onChange={(e) => setFormData({ ...formData, farmLocation: e.target.value })}
              />
              <Input
                label="Farmer Name"
                value={formData.farmFarmer}
                onChange={(e) => setFormData({ ...formData, farmFarmer: e.target.value })}
              />
              <Input
                label="Tags (Comma-separated)"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              />
              <div className="md:col-span-2">
                <Input
                  label="Usage Instructions (Comma-separated)"
                  value={formData.usage}
                  onChange={(e) => setFormData({ ...formData, usage: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="w-full">
            <label className="block text-sm font-sans font-medium text-body mb-1.5">Description</label>
            <textarea
              className="w-full px-4 py-2.5 rounded-lg font-sans bg-white dark:bg-coconut-light/30 border-2 border-coconut/20 dark:border-cream/20 text-coconut dark:text-cream focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
              rows={3}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-coconut/10 dark:border-cream/10 pt-4">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="secondary" loading={loading}>
              {editingProduct ? 'Save Changes' : 'Create Product'}
            </Button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
};

export default AdminProducts;
