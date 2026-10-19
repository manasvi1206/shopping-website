const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    price: { type: Number, required: true }, // regular price
    salePrice: { type: Number }, // optional discounted price
    images: [{ type: String }], // image URLs / paths
    sizes: [{ type: String }], // e.g. ['S','M','L','XL']
    colors: [{ type: String }],
    stock: { type: Number, default: 50 },
    featured: { type: Boolean, default: false },
    rating: { type: Number, default: 4.5 },
    // Key highlights shown as a spec table on the product page (fabric, fit, occasion, etc.)
    specs: {
      fabric: String,
      fit: String,
      occasion: String,
      washCare: String,
      neck: String,
      sleeveLength: String,
      sleeveType: String,
      pattern: String,
    },
    // Optional size chart (inches) shown in a modal on the product page
    sizeChart: [
      {
        size: String,
        bust: Number,
        waist: Number,
        hip: Number,
      },
    ],
  },
  { timestamps: true }
);

productSchema.virtual('discountPercent').get(function () {
  if (!this.salePrice || this.salePrice >= this.price) return 0;
  return Math.round(((this.price - this.salePrice) / this.price) * 100);
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
