const express = require('express');
const { createRazorpayOrder, completeDemoPayment, verifyRazorpayPayment } = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/create-razorpay-order', protect, createRazorpayOrder);
router.post('/verify-payment', protect, verifyRazorpayPayment);
router.post('/demo-complete', protect, completeDemoPayment);

module.exports = router;
