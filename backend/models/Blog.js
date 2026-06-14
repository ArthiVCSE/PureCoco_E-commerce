const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String, default: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80' },
    author: { type: String, required: true, default: 'PureCoco Team' },
    category: { type: String, default: 'Wellness' },
    readTime: { type: String, default: '5 min' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Blog', blogSchema);
