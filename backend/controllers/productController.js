const Product = require('../models/Product');

const mockProducts = [
  {
    _id: '1', name: 'Virgin Cold-Pressed Coconut Oil', slug: 'virgin-cold-pressed',
    description: 'Single-origin virgin coconut oil cold-pressed within 4 hours of harvest.',
    price: 549, originalPrice: 649, size: '500ml', category: 'cooking',
    images: ['https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&q=80'],
    purityScore: 97, purityMetrics: { lauricAcid: 48.2, moisture: 0.05, ffa: 0.08, peroxide: 0.5 },
    batchId: 'PC-2026-A7K9M2', harvestDate: new Date('2026-03-15'), inStock: true, stock: 120,
    rating: 4.9, reviewCount: 234, tags: ['bestseller'], usage: ['cooking', 'wellness'],
    farm: { name: 'Green Valley Estate', location: 'Pollachi, Tamil Nadu', farmer: 'Rajan Kumar' },
  },
];

exports.getProducts = async (req, res) => {
  try {
    const { category, search, sort } = req.query;
    let query = { isActive: true };
    if (category) query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' };

    let products = await Product.find(query);
    if (!products.length) products = mockProducts;

    if (sort === 'price-low') products.sort((a, b) => a.price - b.price);
    if (sort === 'price-high') products.sort((a, b) => b.price - a.price);
    if (sort === 'purity') products.sort((a, b) => b.purityScore - a.purityScore);

    res.json({ products, total: products.length });
  } catch (error) {
    res.json({ products: mockProducts, total: mockProducts.length });
  }
};

exports.getProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) product = mockProducts.find((p) => p._id === req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    const product = mockProducts.find((p) => p._id === req.params.id);
    if (product) return res.json(product);
    res.status(404).json({ message: 'Product not found' });
  }
};

exports.getProductBySlug = async (req, res) => {
  try {
    let product = await Product.findOne({ slug: req.params.slug });
    if (!product) product = mockProducts.find((p) => p.slug === req.params.slug);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(404).json({ message: 'Product not found' });
  }
};

exports.verifyBatch = async (req, res) => {
  try {
    const batchId = req.params.batchId.toUpperCase();
    let product = await Product.findOne({ batchId });
    if (!product) product = mockProducts.find((p) => p.batchId === batchId);
    if (!product) {
      return res.json({ verified: false, message: 'Batch ID not found in our records' });
    }
    res.json({ verified: true, product, message: 'Batch verified successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.uploadImage = (req, res) => {
  if (req.file) {
    res.json({
      url: `/uploads/${req.file.filename}`
    });
  } else {
    res.status(400).json({ message: 'No image uploaded' });
  }
};
