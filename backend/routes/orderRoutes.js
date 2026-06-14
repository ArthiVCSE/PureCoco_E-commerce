const express = require('express');
const {
  createOrder, getMyOrders, getOrder, getAllOrders, updateOrderStatus, getAnalytics, updateOrderAvailability, deleteOrder
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/my', protect, getMyOrders);
router.get('/analytics', protect, admin, getAnalytics);
router.get('/:id', protect, getOrder);
router.get('/', protect, admin, getAllOrders);
router.put('/:id/status', protect, admin, updateOrderStatus);
router.put('/:id/availability', protect, updateOrderAvailability);
router.delete('/:id', protect, admin, deleteOrder);

module.exports = router;
