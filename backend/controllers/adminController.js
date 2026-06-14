const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');

exports.getDashboardStats = async (req, res) => {
  try {
    const [productCount, orderCount, userCount, orders] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      User.countDocuments(),
      Order.find().sort({ createdAt: -1 }).limit(5),
    ]);

    const revenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);

    res.json({
      stats: { products: productCount, orders: orderCount, users: userCount, revenue },
      recentOrders: orders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
