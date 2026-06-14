const express = require('express');
const { createMessage, getMessages, getMessageById, updateMessageStatus, deleteMessage } = require('../controllers/messageController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

router.post('/', createMessage);
router.get('/', protect, admin, getMessages);
router.get('/:id', protect, admin, getMessageById);
router.put('/:id', protect, admin, updateMessageStatus);
router.delete('/:id', protect, admin, deleteMessage);

module.exports = router;
