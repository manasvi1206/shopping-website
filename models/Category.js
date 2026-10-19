const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    tagline: { type: String, trim: true },
    image: { type: String, default: '/images/placeholder.png' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Category', categorySchema);
