require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Product = require('./models/Product');
const User = require('./models/User');

const products = [
  {
    name: 'Virgin Cold-Pressed Coconut Oil',
    slug: 'virgin-cold-pressed',
    description: 'Single-origin virgin coconut oil cold-pressed within 4 hours of harvest from Pollachi farms. Rich in lauric acid with a delicate natural aroma.',
    price: 549, originalPrice: 649, size: '500ml', category: 'cooking',
    images: [
      'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&q=80',
      'https://images.unsplash.com/photo-1584557262817-cd41b91d9470?w=800&q=80',
    ],
    purityScore: 97,
    purityMetrics: { lauricAcid: 48.2, moisture: 0.05, ffa: 0.08, peroxide: 0.5 },
    batchId: 'PC-2026-A7K9M2', harvestDate: new Date('2026-03-15'),
    inStock: true, stock: 120, rating: 4.9, reviewCount: 234,
    tags: ['bestseller', 'organic'], usage: ['cooking', 'wellness'],
    farm: { name: 'Green Valley Estate', location: 'Pollachi, Tamil Nadu', farmer: 'Rajan Kumar' },
  },
  {
    name: 'Extra Virgin Premium Oil',
    slug: 'extra-virgin-premium',
    description: 'Our flagship extra virgin oil from mature coconuts. Glass-bottled to preserve freshness and nutrients.',
    price: 899, originalPrice: 1099, size: '1L', category: 'cooking',
    images: [
      'https://images.unsplash.com/photo-1620916297360-f860d95c6b8a?w=800&q=80',
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80',
    ],
    purityScore: 99,
    purityMetrics: { lauricAcid: 49.5, moisture: 0.03, ffa: 0.05, peroxide: 0.3 },
    batchId: 'PC-2026-B3X8P1', harvestDate: new Date('2026-03-10'),
    inStock: true, stock: 85, rating: 5.0, reviewCount: 189,
    tags: ['premium', 'glass-bottle'], usage: ['cooking', 'wellness', 'skin'],
    farm: { name: 'Sunrise Coconut Grove', location: 'Pollachi, Tamil Nadu', farmer: 'Meena Devi' },
  },
  {
    name: 'Hair & Skin Care Oil',
    slug: 'hair-skin-care',
    description: 'Specially filtered for cosmetic use. Lightweight, non-greasy formula perfect for hair masks and skin nourishment.',
    price: 699, originalPrice: 799, size: '250ml', category: 'beauty',
    images: [
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=80',
      'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&q=80',
    ],
    purityScore: 96,
    purityMetrics: { lauricAcid: 47.0, moisture: 0.06, ffa: 0.09, peroxide: 0.6 },
    batchId: 'PC-2026-C5N2R7', harvestDate: new Date('2026-02-28'),
    inStock: true, stock: 200, rating: 4.8, reviewCount: 156,
    tags: ['beauty', 'new'], usage: ['hair', 'skin'],
    farm: { name: 'Green Valley Estate', location: 'Pollachi, Tamil Nadu', farmer: 'Rajan Kumar' },
  },
  {
    name: 'Family Pack Value Oil',
    slug: 'family-pack',
    description: 'Economical 2L pack for families. Same premium quality, better value. Perfect for daily cooking needs.',
    price: 1499, originalPrice: 1799, size: '2L', category: 'cooking',
    images: [
      'https://images.unsplash.com/photo-1599599810769-a3b9f1c4b3c2?w=800&q=80',
      'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&q=80',
    ],
    purityScore: 94,
    purityMetrics: { lauricAcid: 46.5, moisture: 0.08, ffa: 0.1, peroxide: 0.8 },
    batchId: 'PC-2026-D1W4T9', harvestDate: new Date('2026-03-01'),
    inStock: true, stock: 60, rating: 4.7, reviewCount: 98,
    tags: ['value', 'family'], usage: ['cooking'],
    farm: { name: 'Heritage Farms', location: 'Pollachi, Tamil Nadu', farmer: 'Selvam P.' },
  },
  {
    name: 'Ayurvedic Wellness Oil',
    slug: 'ayurvedic-wellness',
    description: 'Traditional wood-pressed oil for daily wellness rituals — oil pulling, massage, and morning consumption.',
    price: 799, originalPrice: 949, size: '500ml', category: 'wellness',
    images: [
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80',
      'https://images.unsplash.com/photo-1571019613454-83cb1d899fa3?w=800&q=80',
    ],
    purityScore: 98,
    purityMetrics: { lauricAcid: 48.8, moisture: 0.04, ffa: 0.06, peroxide: 0.4 },
    batchId: 'PC-2026-E8H3V5', harvestDate: new Date('2026-03-18'),
    inStock: true, stock: 95, rating: 4.9, reviewCount: 142,
    tags: ['wellness', 'organic'], usage: ['wellness', 'skin'],
    farm: { name: 'Sunrise Coconut Grove', location: 'Pollachi, Tamil Nadu', farmer: 'Meena Devi' },
  },
  {
    name: 'Organic Farm Reserve',
    slug: 'organic-farm-reserve',
    description: 'Limited edition from certified organic plots. Small-batch pressed and numbered for collectors and connoisseurs.',
    price: 1299, originalPrice: 1499, size: '750ml', category: 'cooking',
    images: [
      'https://images.unsplash.com/photo-1500595040803-6d735ecc8d0a?w=800&q=80',
      'https://images.unsplash.com/photo-1584557262817-cd41b91d9470?w=800&q=80',
    ],
    purityScore: 99,
    purityMetrics: { lauricAcid: 49.8, moisture: 0.02, ffa: 0.04, peroxide: 0.2 },
    batchId: 'PC-2026-F2K7N4', harvestDate: new Date('2026-03-20'),
    inStock: true, stock: 40, rating: 5.0, reviewCount: 67,
    tags: ['premium', 'organic', 'new'], usage: ['cooking', 'wellness'],
    farm: { name: 'Heritage Farms', location: 'Pollachi, Tamil Nadu', farmer: 'Selvam P.' },
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');

    await Product.deleteMany({});
    await User.deleteMany({});

    await Product.insertMany(products);
    console.log(`✓ ${products.length} products seeded`);

    await User.create({
      name: 'Admin',
      email: 'admin@purecoco.com',
      password: 'admin1234',
      role: 'admin',
    });
    await User.create({
      name: 'Demo User',
      email: 'demo@purecoco.com',
      password: 'demo1234',
      role: 'user',
    });
    console.log('✓ Admin & demo users created');

    console.log('\n✅ Database seeded successfully!');
    console.log('   Admin: admin@purecoco.com / admin1234');
    console.log('   User:  demo@purecoco.com / demo1234');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  }
};

seedDB();
