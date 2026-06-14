const express = require('express');
const { getBlogs, getBlog, createBlog, updateBlog, deleteBlog } = require('../controllers/blogController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

router.get('/', getBlogs);
router.get('/:slug', getBlog);
router.post('/', protect, admin, createBlog);
router.put('/:slug', protect, admin, updateBlog);
router.delete('/:slug', protect, admin, deleteBlog);

module.exports = router;
