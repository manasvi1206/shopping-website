const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET register page
router.get('/register', (req, res) => {
  res.render('auth/register', {
    title: 'Create Account',
    redirect: req.query.redirect || '/',
  });
});

// POST register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, redirect } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      req.flash('error', 'An account with that email already exists.');
      return res.redirect(`/auth/register?redirect=${encodeURIComponent(redirect || '/')}`);
    }
    const user = await User.create({ name, email, password, phone });
    req.session.userId = user._id;
    req.session.userName = user.name;
    req.session.userRole = user.role;
    req.flash('success', `Welcome to Aurelle, ${user.name}!`);
    res.redirect(redirect && redirect.startsWith('/') ? redirect : '/');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong. Please try again.');
    res.redirect('/auth/register');
  }
});

// GET login page
router.get('/login', (req, res) => {
  res.render('auth/login', {
    title: 'Sign In',
    redirect: req.query.redirect || '/',
  });
});

// POST login
router.post('/login', async (req, res) => {
  try {
    const { email, password, redirect } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      req.flash('error', 'Invalid email or password.');
      return res.redirect(`/auth/login?redirect=${encodeURIComponent(redirect || '/')}`);
    }
    req.session.userId = user._id;
    req.session.userName = user.name;
    req.session.userRole = user.role;
    req.flash('success', `Welcome back, ${user.name}!`);

    // If admin logged in and no specific redirect was requested, go to /admin
    if (redirect && redirect.startsWith('/') && redirect !== '/auth/login') {
      return res.redirect(redirect);
    }
    if (user.role === 'admin') {
      return res.redirect('/admin');
    }
    res.redirect('/');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong. Please try again.');
    res.redirect('/auth/login');
  }
});

// Quick demo admin one-click login helper
router.post('/demo-admin', async (req, res) => {
  try {
    let admin = await User.findOne({ email: 'admin@example.com' });
    if (!admin) {
      admin = await User.create({
        name: 'Aurelle Admin',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin',
      });
    }
    req.session.userId = admin._id;
    req.session.userName = admin.name;
    req.session.userRole = 'admin';
    req.flash('success', 'Logged in as Admin (Demo Access). Welcome to the Aurelle Control Panel!');
    res.redirect('/admin');
  } catch (err) {
    console.error(err);
    res.redirect('/admin');
  }
});

// GET logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

module.exports = router;
