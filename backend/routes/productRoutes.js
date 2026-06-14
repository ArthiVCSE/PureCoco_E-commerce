const express = require('express');
const {
  getProducts, getProduct, getProductBySlug, verifyBatch,
  createProduct, updateProduct, deleteProduct, uploadImage
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

const router = express.Router();

router.get('/', getProducts);
router.get('/verify/:batchId', verifyBatch);
router.get('/slug/:slug', getProductBySlug);
router.get('/:id', getProduct);
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);
router.post('/upload', protect, admin, upload.single('image'), uploadImage);

module.exports = router;
