const Order = require('../models/Order');
const Notification = require('../models/Notification');
const Product = require('../models/Product');
const { sendEmail } = require('../utils/sendEmail');

const calculateOrderTotals = async (items = []) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('Order must include at least one item');
  }

  const ids = items.map(item => item.product).filter(Boolean);
  const products = await Product.find({ _id: { $in: ids }, isActive: true });
  const productMap = new Map(products.map(product => [product._id.toString(), product]));

  const normalizedItems = items.map(item => {
    const quantity = Number(item.quantity) || 1;
    const product = productMap.get(item.product?.toString());
    if (!product) throw new Error(`Product not found: ${item.name || item.product}`);
    if (!product.inStock || product.stock < quantity) {
      throw new Error(`${product.name} is not available in requested quantity`);
    }

    return {
      product: product._id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.images?.[0] || '',
    };
  });

  const subtotal = normalizedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 999 ? 0 : 79;
  return { items: normalizedItems, subtotal, shipping, total: subtotal + shipping };
};

exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;
    const totals = await calculateOrderTotals(items);
    const order = await Order.create({
      user: req.user._id,
      items: totals.items,
      shippingAddress,
      paymentMethod,
      paymentStatus: 'pending',
      subtotal: totals.subtotal,
      shipping: totals.shipping,
      total: totals.total,
      status: 'processing',
      tracking: {
        carrier: 'BlueDart',
        trackingId: `BD${Date.now()}`,
        estimatedDelivery: new Date(Date.now() + 5 * 86400000),
      },
    });

    await Promise.all(totals.items.map(item =>
      Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } })
    ));

    await Notification.create({
      userId: req.user._id,
      type: 'order',
      title: 'New order placed',
      message: `Order #${order._id.toString().slice(-8).toUpperCase()} was placed for INR ${totals.total}.`,
      orderId: order._id,
      sendEmail: false,
    });

    sendEmail({
      to: shippingAddress.email,
      subject: `PureCoco Order Confirmation #${order._id.toString().slice(-6)}`,
      html: `<h2>Thank you for your order!</h2><p>Order total: INR ${totals.total}</p><p>Track your order at purecoco.in/track/${order._id}</p>`,
    }).catch(console.error);

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, tracking } = req.body;
    const update = {};
    if (status) update.status = status;
    if (tracking) {
      update.tracking = {
        carrier: tracking.carrier,
        trackingId: tracking.trackingId,
        estimatedDelivery: tracking.estimatedDelivery,
      };
    }
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (status) {
      await Notification.create({
        userId: order.user,
        type: status === 'out-for-delivery' ? 'delivery' : 'order',
        title: `Order ${status}`,
        message: `Your order #${order._id.toString().slice(-8).toUpperCase()} is now ${status}.`,
        orderId: order._id,
        sendEmail: false,
      });
    }

    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateOrderAvailability = async (req, res) => {
  try {
    const { deliveryAvailability, deliveryNotes } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { deliveryAvailability, deliveryNotes },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const orders = await Order.find();
    
    // Calculate simple analytics based on all orders
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    
    // Group orders by month (last 6 months)
    const months = [];
    const revenueByMonth = [];
    const ordersByMonth = [];
    
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push(d.toLocaleString('default', { month: 'short' }));
      
      const monthOrders = orders.filter(o => {
        const orderDate = new Date(o.createdAt);
        return orderDate.getMonth() === d.getMonth() && orderDate.getFullYear() === d.getFullYear();
      });
      
      revenueByMonth.push(monthOrders.reduce((sum, o) => sum + o.total, 0));
      ordersByMonth.push(monthOrders.length);
    }

    const productSales = {};
    orders.forEach(order => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach(item => {
          if (!productSales[item.product]) {
            productSales[item.product] = { name: item.name, sales: 0 };
          }
          productSales[item.product].sales += item.quantity;
        });
      }
    });

    const topProductsList = Object.values(productSales)
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 4);

    const maxSales = Math.max(...topProductsList.map(p => p.sales), 1);
    
    const topProducts = topProductsList.map(p => ({
      name: p.name,
      sales: p.sales,
      pct: Math.round((p.sales / maxSales) * 100)
    }));

    res.json({
      totalRevenue,
      totalOrders,
      months,
      revenueByMonth,
      ordersByMonth,
      topProducts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
