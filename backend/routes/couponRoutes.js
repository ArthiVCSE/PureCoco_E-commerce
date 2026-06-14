const express = require('express');
const router = express.Router();
const { createCoupon, getCoupons, validateCoupon, deleteCoupon } = require('../controllers/couponController');
const { protect, admin } = require('../middleware/auth');

router.post('/', protect, admin, createCoupon);
router.get('/', protect, admin, getCoupons);
router.post('/validate', validateCoupon);
router.delete('/:id', protect, admin, deleteCoupon);

module.exports = router;
