const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

function getCart(req) {
  if (!req.session.cart) req.session.cart = [];
  return req.session.cart;
}

// View cart
router.get('/', (req, res) => {
  const cart = getCart(req);
  const itemsTotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  res.render('cart/index', { title: 'Your Cart', cart, itemsTotal });
});

// Add to cart
router.post('/add/:productId', async (req, res) => {
  const product = await Product.findById(req.params.productId);
  if (!product) {
    req.flash('error', 'Product not found.');
    return res.redirect('back');
  }
  const { size = '', color = '', quantity = 1 } = req.body;
  const cart = getCart(req);
  const price = product.salePrice || product.price;

  const existing = cart.find(
    (i) => i.productId === String(product._id) && i.size === size && i.color === color
  );
  if (existing) {
    existing.quantity += Number(quantity);
  } else {
    cart.push({
      productId: String(product._id),
      name: product.name,
      slug: product.slug,
      image: product.images[0] || '/images/placeholder.png',
      price,
      size,
      color,
      quantity: Number(quantity),
    });
  }
  req.session.cart = cart;
  req.flash('success', `${product.name} added to cart.`);
  res.redirect('/cart');
});

// Update quantity
router.post('/update/:index', (req, res) => {
  const cart = getCart(req);
  const idx = Number(req.params.index);
  const { quantity } = req.body;
  if (cart[idx]) {
    cart[idx].quantity = Math.max(1, Number(quantity));
  }
  req.session.cart = cart;
  res.redirect('/cart');
});

// Remove item
router.post('/remove/:index', (req, res) => {
  const cart = getCart(req);
  const idx = Number(req.params.index);
  if (cart[idx]) cart.splice(idx, 1);
  req.session.cart = cart;
  res.redirect('/cart');
});

module.exports = router;
