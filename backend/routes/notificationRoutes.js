const express = require('express');
const {
  createNotification,
  getUserNotifications,
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} = require('../controllers/notificationController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, admin, createNotification);
router.get('/', protect, admin, getNotifications);
router.get('/user/:userId', protect, getUserNotifications);
router.put('/:id/read', protect, markAsRead);
router.patch('/:id/read', protect, markAsRead);
router.put('/user/:userId/read-all', protect, markAllAsRead);
router.patch('/user/:userId/read-all', protect, markAllAsRead);
router.delete('/:id', protect, deleteNotification);

module.exports = router;
