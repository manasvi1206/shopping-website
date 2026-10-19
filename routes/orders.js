const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { isAuthenticated } = require('../middleware/auth');

// Checkout page
router.get('/checkout', isAuthenticated, (req, res) => {
  const cart = req.session.cart || [];
  if (cart.length === 0) {
    req.flash('error', 'Your cart is empty.');
    return res.redirect('/cart');
  }
  const itemsTotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shippingFee = itemsTotal >= 1999 ? 0 : 99;
  res.render('cart/checkout', {
    title: 'Checkout',
    cart,
    itemsTotal,
    shippingFee,
    grandTotal: itemsTotal + shippingFee,
  });
});

// Place order (Cash on Delivery demo — plug in a payment gateway here for real payments)
router.post('/checkout', isAuthenticated, async (req, res) => {
  const cart = req.session.cart || [];
  if (cart.length === 0) {
    req.flash('error', 'Your cart is empty.');
    return res.redirect('/cart');
  }
  const { line1, city, state, pincode, phone } = req.body;
  const itemsTotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shippingFee = itemsTotal >= 1999 ? 0 : 99;

  const order = await Order.create({
    user: req.session.userId,
    items: cart.map((i) => ({
      product: i.productId,
      name: i.name,
      image: i.image,
      size: i.size,
      color: i.color,
      price: i.price,
      quantity: i.quantity,
    })),
    shippingAddress: { line1, city, state, pincode, phone },
    itemsTotal,
    shippingFee,
    grandTotal: itemsTotal + shippingFee,
  });

  req.session.cart = [];
  res.redirect(`/orders/confirmation/${order._id}`);
});

// Order confirmation
router.get('/confirmation/:id', isAuthenticated, async (req, res) => {
  const order = await Order.findById(req.params.id).populate('items.product');
  if (!order) return res.redirect('/');
  res.render('cart/confirmation', { title: 'Order Confirmed', order });
});

// Order history
router.get('/my-orders', isAuthenticated, async (req, res) => {
  const orders = await Order.find({ user: req.session.userId }).sort({ createdAt: -1 });
  res.render('cart/my-orders', { title: 'My Orders', orders });
});

module.exports = router;
