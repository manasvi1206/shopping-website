# Aurelle — Clothing E-Commerce Website

A full-stack shopping website built with **Node.js, Express, MongoDB (Mongoose), EJS, and Bootstrap 5** — featuring a homepage banner, category browsing, product listing/filtering, product detail pages, session-based cart, checkout, order history, user auth, and an admin panel for managing products/categories/orders.

## Features

- 🏠 Homepage with hero banner, categories, featured & new arrival products
- 🛍️ Shop page with category filter, search, and sorting
- 👗 Product detail page with size/color selection
- 🛒 Session-based shopping cart (add/update/remove)
- 📦 Checkout with shipping address + Cash on Delivery (plug in Razorpay/Stripe for real payments)
- 🔐 User registration/login (bcrypt password hashing, sessions stored in MongoDB)
- 📜 Order history for customers
- 🛠️ Admin panel: manage products (with image upload), categories, and order status

## Tech Stack

| Layer      | Tech                                  |
|------------|----------------------------------------|
| Backend    | Node.js, Express.js                    |
| Database   | MongoDB + Mongoose                     |
| Frontend   | EJS templates, Bootstrap 5, custom CSS |
| Auth       | express-session + connect-mongo + bcryptjs |
| File Upload| Multer (for product images)            |

## Getting Started

### 1. Prerequisites
- Node.js v18+
- MongoDB running locally (`mongod`) or a MongoDB Atlas connection string

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Copy `.env.example` to `.env` and edit as needed:
```bash
cp .env.example .env
```
```
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/shopping_website
SESSION_SECRET=some_long_random_string
```

### 4. Seed sample data (optional but recommended)
This creates sample categories, products, and a default admin account.
```bash
npm run seed
```
Default admin login: **admin@example.com / admin123** (change this immediately after first login by adding a proper "change password" flow, or update it directly in the database).

### 5. Run the app
```bash
npm run dev     # with nodemon (auto-restart)
# or
npm start
```
Visit **http://localhost:3000**

## Project Structure
```
shopping-website/
├── config/db.js          # MongoDB connection
├── middleware/auth.js     # Auth guards + session locals
├── models/                # Mongoose schemas (User, Product, Category, Order)
├── routes/                # auth, products, cart, orders, admin
├── views/                 # EJS templates (layout, partials, pages)
├── public/                # CSS + uploaded product images
├── seed.js                # Sample data seeder
└── server.js               # App entry point
```

## Notes & Next Steps
- **Payments**: Checkout currently defaults to Cash on Delivery. To accept real payments, integrate a gateway like Razorpay or Stripe in `routes/orders.js`.
- **Image storage**: Uploaded images are saved to `public/images/products`. For production, consider using cloud storage (S3, Cloudinary) instead of local disk.
- **Security**: Change `SESSION_SECRET`, use HTTPS in production, and rotate the default admin password immediately.
- **Deployment**: Works well on Render, Railway, or a VPS. Use MongoDB Atlas for a managed database.
