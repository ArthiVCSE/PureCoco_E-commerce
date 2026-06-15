const Notification = require('../models/Notification');
const { sendEmail } = require('../utils/sendEmail');

exports.createNotification = async (req, res) => {
  try {
    const { userId, type, title, message, orderId, productId, sendEmail: shouldSendEmail, sendSMS } = req.body;

    const notification = new Notification({
      userId,
      type,
      title,
      message,
      orderId,
      productId,
      sendEmail: shouldSendEmail !== false,
      sendSMS: sendSMS || false,
    });

    await notification.save();

    // Send email if enabled
    if (shouldSendEmail !== false && userId) {
      const User = require('../models/User');
      const user = await User.findById(userId);
      if (user && user.email) {
        try {
          await sendEmail({
            to: user.email,
            subject: title,
            text: message,
          });
        } catch (emailError) {
          console.log('Email notification failed:', emailError.message);
        }
      }
    }

    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    if (userId !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view these notifications' });
    }
    const notifications = await Notification.find({
      $or: [{ userId }, { userId: { $exists: false } }, { userId: null }],
    }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await Notification.findById(id);
    if (!existing) return res.status(404).json({ message: 'Notification not found' });
    if (existing.userId && existing.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this notification' });
    }
    const notification = await Notification.findByIdAndUpdate(
      id,
      { isRead: true, readAt: new Date() },
      { new: true }
    );
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    const { userId } = req.params;
    if (userId !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update these notifications' });
    }
    await Notification.updateMany({ userId, isRead: false }, { isRead: true, readAt: new Date() });
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    if (
      (!notification.userId && req.user.role !== 'admin') ||
      (notification.userId && notification.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin')
    ) {
      return res.status(403).json({ message: 'Not authorized to delete this notification' });
    }
    await notification.deleteOne();
    res.json({ message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
