const Order = require('../models/Order');
const { sendEmail } = require('../utils/sendEmail');

exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, subtotal, shipping, total } = req.body;
    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      paymentMethod,
      subtotal,
      shipping,
      total,
      status: 'processing',
      tracking: {
        carrier: 'BlueDart',
        trackingId: `BD${Date.now()}`,
        estimatedDelivery: new Date(Date.now() + 5 * 86400000),
      },
    });

    await sendEmail({
      to: shippingAddress.email,
      subject: `PureCoco Order Confirmation #${order._id.toString().slice(-6)}`,
      html: `<h2>Thank you for your order!</h2><p>Order total: ₹${total}</p><p>Track your order at purecoco.in/track/${order._id}</p>`,
    });

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

    res.json({
      totalRevenue,
      totalOrders,
      months,
      revenueByMonth,
      ordersByMonth
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
