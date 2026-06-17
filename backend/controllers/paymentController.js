const Order = require('../models/Order');
const { sendEmail } = require('../utils/sendEmail');
const crypto = require('crypto');
const Razorpay = require('razorpay');

const getRazorpay = () => {
  if (!process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID.includes('your_key_here')) return null;
  try {
    return new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  } catch {
    return null;
  }
};

exports.createRazorpayOrder = async (req, res) => {
  try {
    const razorpay = getRazorpay();
    if (!razorpay) {
      return res.status(503).json({ message: 'Razorpay is not configured. Use demo payment mode.' });
    }
    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to pay for this order' });
    }
    if (order.paymentStatus === 'paid') {
      return res.status(400).json({ message: 'Order is already paid' });
    }

    const amount = Math.round((order.total || 0) * 100); // paise

    const options = {
      amount,
      currency: 'INR',
      receipt: order._id.toString(),
    };

    const rzpOrder = await razorpay.orders.create(options);
    res.json({ id: rzpOrder.id, amount: rzpOrder.amount });
  } catch (error) {
    console.error('createRazorpayOrder error', error);
    res.status(500).json({ message: error.message });
  }
};

exports.verifyRazorpayPayment = async (req, res) => {
  try {
    const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!process.env.RAZORPAY_KEY_SECRET) {
      return res.status(503).json({ message: 'Razorpay secret not configured' });
    }

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      order.paymentStatus = 'paid';
      await order.save();

      // Send email optionally
      try {
        await sendEmail({
          to: order.shippingAddress.email,
          subject: `Payment received — Order #${order._id.toString().slice(-6)}`,
          html: `<p>We have received your payment of ₹${order.total}. Your order is being processed.</p>`,
        });
      } catch (e) {
        console.error('Failed to send payment email', e);
      }

      return res.json({ success: true, order });
    }

    res.status(400).json({ message: 'Payment verification failed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.completeDemoPayment = async (req, res) => {
  try {
    if (process.env.RAZORPAY_KEY_ID && !process.env.RAZORPAY_KEY_ID.includes('your_key_here')) {
      return res.status(400).json({ message: 'Demo payment is disabled when Razorpay is configured' });
    }

    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this payment' });
    }
    if (order.paymentMethod === 'cod') {
      return res.status(400).json({ message: 'COD payments cannot be marked paid here' });
    }

    order.paymentStatus = 'paid';
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
