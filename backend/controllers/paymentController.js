const Stripe = require('stripe');
const Order = require('../models/Order');
const { sendEmail } = require('../utils/sendEmail');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

exports.createPaymentIntent = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const amount = Math.round((order.total || 0) * 100); // smallest currency unit

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: process.env.STRIPE_CURRENCY || 'inr',
      metadata: { orderId: order._id.toString() },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('createPaymentIntent error', error);
    res.status(500).json({ message: error.message });
  }
};

exports.handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    if (endpointSecret) {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } else {
      // if no webhook secret configured, parse directly (less secure)
      event = req.body;
    }
  } catch (err) {
    console.error('Webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded': {
      const pi = event.data.object;
      const orderId = pi.metadata && pi.metadata.orderId;
      if (orderId) {
        try {
          const order = await Order.findByIdAndUpdate(orderId, { paymentStatus: 'paid' }, { new: true });
          if (order) {
            await sendEmail({
              to: order.shippingAddress.email,
              subject: `Payment received — Order #${order._id.toString().slice(-6)}`,
              html: `<p>We have received your payment of ₹${order.total}. Your order is being processed.</p>`,
            });
          }
        } catch (e) {
          console.error('Error updating order after payment', e);
        }
      }
      break;
    }
    case 'payment_intent.payment_failed': {
      const pi = event.data.object;
      const orderId = pi.metadata && pi.metadata.orderId;
      if (orderId) {
        try {
          await Order.findByIdAndUpdate(orderId, { paymentStatus: 'failed' });
        } catch (e) {
          console.error('Error marking payment failed', e);
        }
      }
      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};
