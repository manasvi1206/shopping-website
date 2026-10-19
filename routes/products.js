const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Category = require('../models/Category');

// Home page
router.get('/', async (req, res) => {
  const [categories, featured, newArrivals] = await Promise.all([
    Category.find(),
    Product.find({ featured: true }).limit(8).populate('category'),
    Product.find().sort({ createdAt: -1 }).limit(8).populate('category'),
  ]);
  res.render('home', { title: 'Home', categories, featured, newArrivals });
});

// All products / shop (collection) page with filters — mirrors a typical
// e-commerce collection page: type/category, size, price range, availability, sort.
router.get('/shop', async (req, res) => {
  const { category, sort, q, size, minPrice, maxPrice, inStock } = req.query;

  // Base filter used for the final product query
  const filter = {};
  if (category) {
    const cat = await Category.findOne({ slug: category });
    if (cat) filter.category = cat._id;
  }
  if (q) filter.name = { $regex: q, $options: 'i' };
  if (size) filter.sizes = size; // matches products whose sizes array contains this size
  if (inStock === 'true') filter.stock = { $gt: 0 };

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  let sortOption = { createdAt: -1 }; // Date, new to old (default)
  if (sort === 'price_asc') sortOption = { price: 1 };
  if (sort === 'price_desc') sortOption = { price: -1 };
  if (sort === 'best_selling') sortOption = { rating: -1 };
  if (sort === 'featured') sortOption = { featured: -1, createdAt: -1 };

  // Build size/category counts against everything in the current category
  // (excluding the size/price filters) so the sidebar counts behave like a
  // typical Shopify-style faceted filter ("Bottoms (4)", "S (31)", etc).
  const facetBaseFilter = {};
  if (category) {
    const cat = await Category.findOne({ slug: category });
    if (cat) facetBaseFilter.category = cat._id;
  }

  const [products, categories, allInScope] = await Promise.all([
    Product.find(filter).sort(sortOption).populate('category'),
    Category.find(),
    Product.find(facetBaseFilter),
  ]);

  // Category (type) counts — how many products exist per category overall
  const categoryCounts = {};
  categories.forEach((c) => (categoryCounts[c.slug] = 0));
  await Promise.all(
    categories.map(async (c) => {
      categoryCounts[c.slug] = await Product.countDocuments({ category: c._id });
    })
  );

  // Size counts within current category scope
  const sizeCounts = {};
  const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  ALL_SIZES.forEach((s) => (sizeCounts[s] = 0));
  allInScope.forEach((p) => {
    (p.sizes || []).forEach((s) => {
      if (sizeCounts[s] !== undefined) sizeCounts[s] += 1;
    });
  });

  res.render('products/shop', {
    title: category ? categories.find((c) => c.slug === category)?.name || 'Shop' : 'Shop',
    products,
    categories,
    categoryCounts,
    sizeCounts,
    allSizes: ALL_SIZES,
    activeCategory: category || '',
    activeSort: sort || '',
    activeSize: size || '',
    minPrice: minPrice || '',
    maxPrice: maxPrice || '',
    inStock: inStock === 'true',
    q: q || '',
    productCount: products.length,
  });
});

// Alias route so URLs like /collections/dresses behave like /shop?category=dresses
router.get('/collections/:slug', (req, res) => {
  const query = new URLSearchParams({ ...req.query, category: req.params.slug }).toString();
  res.redirect(`/shop?${query}`);
});

// Product detail page
router.get('/product/:slug', async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug }).populate('category');
  if (!product) {
    req.flash('error', 'Product not found.');
    return res.redirect('/shop');
  }
  const related = await Product.find({
    category: product.category._id,
    _id: { $ne: product._id },
  }).limit(4);
  res.render('products/detail', { title: product.name, product, related });
});

module.exports = router;
