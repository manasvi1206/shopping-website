require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const expressLayouts = require('express-ejs-layouts');

const connectDB = require('./config/db');
const { loadUser } = require('./middleware/auth');

const app = express();

// --- DB ---
connectDB();

// --- View engine ---
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');

// --- Middleware ---
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dev_secret_change_me',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/shopping_website',
    }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 }, // 7 days
  })
);
app.use(flash());
app.use(loadUser);

// Make flash messages available in every view
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

// --- Routes ---
app.use('/auth', require('./routes/auth'));
app.use('/cart', require('./routes/cart'));
app.use('/orders', require('./routes/orders'));
app.use('/admin', require('./routes/admin'));
app.use('/', require('./routes/products')); // home + /shop + /product/:slug

// --- 404 handler ---
app.use((req, res) => {
  res.status(404).render('404', { title: 'Page Not Found' });
});

// --- Error handler ---
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Something went wrong on our end. Please try again later.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
