const Message = require('../models/Message');
const Notification = require('../models/Notification');
const { sendEmail } = require('../utils/sendEmail');

exports.createMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required' });
    }

    const newMessage = new Message({ name, email, message });
    await newMessage.save();

    await Notification.create({
      type: 'announcement',
      title: 'New customer message',
      message: `${name} sent a support message: ${message.slice(0, 120)}`,
      sendEmail: false,
    });

    // Optional: Send confirmation email
    try {
      await sendEmail({
        to: email,
        subject: 'We received your message',
        text: `Hello ${name},\n\nThank you for contacting PureCoco. We have received your message and will reply within 24 hours.\n\nBest regards,\nPureCoco Team`,
      });
    } catch (emailError) {
      console.log('Confirmation email not sent (optional):', emailError.message);
    }

    res.status(201).json({ message: 'Message sent successfully', data: newMessage });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMessageById = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ message: 'Message not found' });
    if (!message.isRead) {
      message.isRead = true;
      if (message.status === 'new') message.status = 'read';
      await message.save();
    }
    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateMessageStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const message = await Message.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!message) return res.status(404).json({ message: 'Message not found' });
    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) return res.status(404).json({ message: 'Message not found' });
    res.json({ message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
