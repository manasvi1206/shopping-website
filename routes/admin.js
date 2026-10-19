const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Order = require('../models/Order');
const User = require('../models/User');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

// Protect all admin routes
router.use(isAuthenticated, isAdmin);

// Set dedicated Admin Layout for all admin views
router.use((req, res, next) => {
  res.locals.layout = 'admin/layout';
  res.locals.adminPath = req.path;
  next();
});

// Multer setup for product image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'public', 'images', 'products')),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '-')),
});
const upload = multer({ storage });

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function parseSpecs(body) {
  const { fabric, fit, occasion, washCare, neck, sleeveLength, sleeveType, pattern } = body;
  return { fabric, fit, occasion, washCare, neck, sleeveLength, sleeveType, pattern };
}

function parseSizeChart(raw) {
  if (!raw) return [];
  return raw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split(',').map((s) => s.trim());
      return {
        size: parts[0] || '',
        bust: Number(parts[1]) || 0,
        waist: Number(parts[2]) || 0,
        hip: Number(parts[3]) || 0,
      };
    });
}

// ---- DASHBOARD ----
router.get('/', async (req, res) => {
  try {
    const [productCount, orderCount, categoryCount, userCount, lowStockCount, recentOrders, allOrders] =
      await Promise.all([
        Product.countDocuments(),
        Order.countDocuments(),
        Category.countDocuments(),
        User.countDocuments(),
        Product.countDocuments({ stock: { $lte: 10 } }),
        Order.find().sort({ createdAt: -1 }).limit(6).populate('user'),
        Order.find(),
      ]);

    // Calculate total revenue from non-cancelled orders
    const totalRevenue = allOrders
      .filter((o) => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + (o.grandTotal || 0), 0);

    // Calculate order distribution
    const statusCounts = {
      Placed: 0,
      Processing: 0,
      Shipped: 0,
      Delivered: 0,
      Cancelled: 0,
    };
    allOrders.forEach((o) => {
      if (statusCounts[o.status] !== undefined) statusCounts[o.status]++;
    });

    res.render('admin/dashboard', {
      title: 'Admin Dashboard',
      productCount,
      orderCount,
      categoryCount,
      userCount,
      lowStockCount,
      totalRevenue,
      recentOrders,
      statusCounts,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading dashboard');
  }
});

// ---- PRODUCTS ----
router.get('/products', async (req, res) => {
  try {
    const { q, category } = req.query;
    const filter = {};
    if (q) {
      filter.name = { $regex: q, $options: 'i' };
    }
    if (category) {
      filter.category = category;
    }

    const [products, categories] = await Promise.all([
      Product.find(filter).populate('category').sort({ createdAt: -1 }),
      Category.find(),
    ]);

    res.render('admin/products', {
      title: 'Products Management',
      products,
      categories,
      q: q || '',
      selectedCategory: category || '',
    });
  } catch (err) {
    console.error(err);
    res.redirect('/admin');
  }
});

router.get('/products/new', async (req, res) => {
  const categories = await Category.find();
  res.render('admin/product-form', { title: 'Add New Product', categories, product: null });
});

router.post('/products', upload.array('images', 5), async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      price,
      salePrice,
      sizes,
      colors,
      stock,
      featured,
      imageUrl,
      sizeChartRaw,
    } = req.body;

    let images = [];
    if (req.files && req.files.length) {
      images = req.files.map((f) => '/images/products/' + f.filename);
    } else if (imageUrl && imageUrl.trim()) {
      images = imageUrl
        .split(',')
        .map((u) => u.trim())
        .filter(Boolean);
    }
    if (!images.length) {
      images = ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80'];
    }

    await Product.create({
      name,
      slug: slugify(name) + '-' + Date.now().toString().slice(-4),
      description,
      category,
      price: Number(price),
      salePrice: salePrice ? Number(salePrice) : undefined,
      sizes: sizes ? sizes.split(',').map((s) => s.trim()).filter(Boolean) : [],
      colors: colors ? colors.split(',').map((c) => c.trim()).filter(Boolean) : [],
      stock: stock ? Number(stock) : 50,
      featured: featured === 'on' || featured === 'true',
      images,
      specs: parseSpecs(req.body),
      sizeChart: parseSizeChart(sizeChartRaw),
    });

    req.flash('success', `Product "${name}" published successfully.`);
    res.redirect('/admin/products');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to create product.');
    res.redirect('/admin/products');
  }
});

router.get('/products/:id/edit', async (req, res) => {
  try {
    const [product, categories] = await Promise.all([Product.findById(req.params.id), Category.find()]);
    if (!product) {
      req.flash('error', 'Product not found.');
      return res.redirect('/admin/products');
    }
    res.render('admin/product-form', { title: `Edit: ${product.name}`, categories, product });
  } catch (err) {
    console.error(err);
    res.redirect('/admin/products');
  }
});

router.post('/products/:id', upload.array('images', 5), async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      price,
      salePrice,
      sizes,
      colors,
      stock,
      featured,
      imageUrl,
      sizeChartRaw,
    } = req.body;

    const update = {
      name,
      description,
      category,
      price: Number(price),
      salePrice: salePrice ? Number(salePrice) : undefined,
      sizes: sizes ? sizes.split(',').map((s) => s.trim()).filter(Boolean) : [],
      colors: colors ? colors.split(',').map((c) => c.trim()).filter(Boolean) : [],
      stock: stock ? Number(stock) : 0,
      featured: featured === 'on' || featured === 'true',
      specs: parseSpecs(req.body),
      sizeChart: parseSizeChart(sizeChartRaw),
    };

    if (req.files && req.files.length) {
      update.images = req.files.map((f) => '/images/products/' + f.filename);
    } else if (imageUrl && imageUrl.trim()) {
      update.images = imageUrl
        .split(',')
        .map((u) => u.trim())
        .filter(Boolean);
    }

    await Product.findByIdAndUpdate(req.params.id, update);
    req.flash('success', `Product "${name}" updated successfully.`);
    res.redirect('/admin/products');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to update product.');
    res.redirect('/admin/products');
  }
});

router.post('/products/:id/delete', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    req.flash('success', 'Product deleted.');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Could not delete product.');
  }
  res.redirect('/admin/products');
});

// ---- CATEGORIES ----
router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    // Product count per category
    const categoryCounts = {};
    for (const cat of categories) {
      categoryCounts[cat._id] = await Product.countDocuments({ category: cat._id });
    }
    res.render('admin/categories', {
      title: 'Categories Management',
      categories,
      categoryCounts,
    });
  } catch (err) {
    console.error(err);
    res.redirect('/admin');
  }
});

router.post('/categories', async (req, res) => {
  try {
    const { name, tagline, image } = req.body;
    await Category.create({
      name,
      slug: slugify(name),
      tagline,
      image: image && image.trim() ? image.trim() : 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80',
    });
    req.flash('success', `Category "${name}" created.`);
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to create category.');
  }
  res.redirect('/admin/categories');
});

router.post('/categories/:id/delete', async (req, res) => {
  try {
    const productCount = await Product.countDocuments({ category: req.params.id });
    if (productCount > 0) {
      req.flash('error', `Cannot delete category: ${productCount} product(s) are assigned to it.`);
      return res.redirect('/admin/categories');
    }
    await Category.findByIdAndDelete(req.params.id);
    req.flash('success', 'Category removed successfully.');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to delete category.');
  }
  res.redirect('/admin/categories');
});

// ---- ORDERS ----
router.get('/orders', async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) {
      filter.status = status;
    }
    const orders = await Order.find(filter).populate('user').sort({ createdAt: -1 });
    res.render('admin/orders', {
      title: 'Orders Management',
      orders,
      activeStatus: status || 'all',
    });
  } catch (err) {
    console.error(err);
    res.redirect('/admin');
  }
});

router.post('/orders/:id/status', async (req, res) => {
  try {
    await Order.findByIdAndUpdate(req.params.id, { status: req.body.status });
    req.flash('success', `Order #${req.params.id.slice(-6).toUpperCase()} status updated to ${req.body.status}.`);
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to update order status.');
  }
  res.redirect('/admin/orders');
});

// ---- USERS ----
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    // Count orders per user
    const userOrderCounts = {};
    for (const u of users) {
      userOrderCounts[u._id] = await Order.countDocuments({ user: u._id });
    }
    res.render('admin/users', {
      title: 'Customer & User Accounts',
      users,
      userOrderCounts,
    });
  } catch (err) {
    console.error(err);
    res.redirect('/admin');
  }
});

router.post('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    if (String(req.session.userId) === String(req.params.id) && role !== 'admin') {
      req.flash('error', 'You cannot remove admin rights from your own current session.');
      return res.redirect('/admin/users');
    }
    await User.findByIdAndUpdate(req.params.id, { role });
    req.flash('success', 'User role updated.');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Could not update user role.');
  }
  res.redirect('/admin/users');
});

module.exports = router;
