const express = require('express');
const { getUsers, getUser, updateUser, deleteUser, getWishlist, addToWishlist, removeFromWishlist } = require('../controllers/userController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// Wishlist routes (protected, not admin-only)
router.get('/wishlist', protect, getWishlist);
router.post('/wishlist/add', protect, addToWishlist);
router.post('/wishlist/remove', protect, removeFromWishlist);

// Admin routes
router.use(protect, admin);
router.get('/', getUsers);
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
