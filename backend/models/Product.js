const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 },
    size: { type: String, required: true },
    category: { type: String, enum: ['cooking', 'beauty', 'wellness'], default: 'cooking' },
    images: [{ type: String }],
    purityScore: { type: Number, min: 0, max: 100, default: 90 },
    purityMetrics: {
      lauricAcid: { type: Number, default: 45 },
      moisture: { type: Number, default: 0.1 },
      ffa: { type: Number, default: 0.1 },
      peroxide: { type: Number, default: 1 },
    },
    batchId: { type: String, unique: true },
    harvestDate: { type: Date },
    inStock: { type: Boolean, default: true },
    stock: { type: Number, default: 100, min: 0 },
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    tags: [{ type: String }],
    usage: [{ type: String }],
    farm: {
      name: String,
      location: String,
      farmer: String,
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
