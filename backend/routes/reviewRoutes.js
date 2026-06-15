const express = require('express');
const router = express.Router();
const { createReview, getProductReviews, getReviews, deleteReview } = require('../controllers/reviewController');
const { protect, admin } = require('../middleware/auth');

router.post('/', protect, createReview);
router.get('/', protect, admin, getReviews);
router.get('/product/:productId', getProductReviews);
router.delete('/:id', protect, deleteReview);

module.exports = router;
