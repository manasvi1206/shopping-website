require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Category = require('./models/Category');
const Product = require('./models/Product');
const User = require('./models/User');

async function seed() {
  await connectDB();

  await Promise.all([Category.deleteMany({}), Product.deleteMany({})]);

  const categories = await Category.insertMany([
    {
      name: 'Dresses',
      slug: 'dresses',
      tagline: 'From desk to dinner in effortless silhouette.',
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80',
    },
    {
      name: 'Co-ords',
      slug: 'co-ords',
      tagline: 'Matching sets. Zero styling effort.',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80',
    },
    {
      name: 'Jumpsuits',
      slug: 'jumpsuits',
      tagline: 'The tailored one-piece statement.',
      image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80',
    },
    {
      name: 'Tops',
      slug: 'tops',
      tagline: 'Refined essentials and elevated everyday blouses.',
      image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80',
    },
    {
      name: 'Hustlease',
      slug: 'hustlease',
      tagline: 'Monday to Friday power-dressing essentials.',
      image: 'https://images.unsplash.com/photo-1487222477460-f4476524eaf8?w=800&auto=format&fit=crop&q=80',
    },
  ]);

  const [dresses, coords, jumpsuits, tops, hustlease] = categories;

  const sampleProducts = [
    {
      name: 'Elena Wrap Midi Dress',
      description: 'A signature flattering wrap dress crafted in breathable mulberry crepe with a waist-cinching tie and graceful drape. Seamlessly shifts from morning pitches to evening galas.',
      category: dresses._id,
      price: 3299,
      salePrice: 2589,
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Midnight Black', 'Burgundy Wine'],
      stock: 45,
      featured: true,
      images: [
        'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1568252542512-9fe8fe9c87bb?w=800&auto=format&fit=crop&q=80',
      ],
      specs: {
        fabric: 'Premium Viscose Crepe',
        fit: 'Tailored Wrap Fit',
        occasion: 'Work & Evening',
        washCare: 'Dry clean or gentle hand wash',
        neck: 'Surplice V-Neck',
        sleeveLength: 'Three-Quarter',
        sleeveType: 'Fitted',
        pattern: 'Solid',
      },
      sizeChart: [
        { size: 'XS', bust: 32, waist: 26, hip: 35.5 },
        { size: 'S', bust: 34, waist: 28, hip: 37.5 },
        { size: 'M', bust: 36, waist: 30, hip: 39.5 },
        { size: 'L', bust: 38, waist: 32, hip: 42 },
        { size: 'XL', bust: 40, waist: 34, hip: 44 },
      ],
    },
    {
      name: 'Nora Tailored A-Line Dress',
      description: 'Clean architectural lines meet everyday comfort. Designed with a structured bodice and a gentle A-line flare with discreet in-seam pockets.',
      category: dresses._id,
      price: 3499,
      salePrice: 2799,
      sizes: ['S', 'M', 'L'],
      colors: ['Classic Navy', 'Charcoal Grey'],
      stock: 28,
      featured: true,
      images: [
        'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&auto=format&fit=crop&q=80',
      ],
      specs: {
        fabric: 'Compact Cotton Blend',
        fit: 'A-Line',
        occasion: 'Formal & Smart Casual',
        washCare: 'Machine wash cold',
        neck: 'Jewel Neckline',
        sleeveLength: 'Sleeveless',
        sleeveType: 'Sleeveless',
        pattern: 'Solid',
      },
    },
    {
      name: 'Pragmatic Linen Co-ord Set',
      description: 'Matching tailored blazer-cut vest and wide-leg trousers. Pure elegance without the styling headache — wear together or mix with wardrobe staples.',
      category: coords._id,
      price: 4299,
      salePrice: 3449,
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Caramel Tan', 'Noir Black'],
      stock: 18,
      featured: true,
      images: [
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&auto=format&fit=crop&q=80',
      ],
      specs: {
        fabric: 'Breathable Cotton Linen',
        fit: 'Relaxed Tailored',
        occasion: 'Workplace & Brunches',
        washCare: 'Hand wash cold',
        neck: 'Notched Lapel',
        sleeveLength: 'Sleeveless',
        sleeveType: 'Vest',
        pattern: 'Textured Weave',
      },
    },
    {
      name: 'Sky Utility Jumpsuit',
      description: 'A boardroom-approved statement silhouette with utilitarian flap pockets, adjustable self-belt, and cuffed tapered ankles.',
      category: jumpsuits._id,
      price: 3899,
      salePrice: 2999,
      sizes: ['S', 'M', 'L'],
      colors: ['Sky Slate Blue', 'Olive Khaki'],
      stock: 15,
      featured: true,
      images: [
        'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&auto=format&fit=crop&q=80',
      ],
      specs: {
        fabric: 'Tencel Lyocell',
        fit: 'Regular with Belted Waist',
        occasion: 'Boardroom & Travel',
        washCare: 'Delicate wash',
        neck: 'Collar Neck',
        sleeveLength: 'Full Sleeve',
        sleeveType: 'Roll-tab sleeves',
        pattern: 'Solid',
      },
    },
    {
      name: 'Classic Crisp Poplin Shirt',
      description: 'The definitive white shirt tailored with high thread-count organic cotton, mother-of-pearl buttons, and sculpted French cuffs.',
      category: tops._id,
      price: 1999,
      salePrice: 1599,
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Pristine White', 'Sky Blue Stripe'],
      stock: 60,
      featured: false,
      images: [
        'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1551803091-e20673f15770?w=800&auto=format&fit=crop&q=80',
      ],
      specs: {
        fabric: '100% Organic Poplin Cotton',
        fit: 'Slim Tailored',
        occasion: 'Formal Workwear',
        washCare: 'Warm iron, machine wash',
        neck: 'Spread Collar',
        sleeveLength: 'Full',
        sleeveType: 'Button Cuffs',
        pattern: 'Crisp Solid',
      },
    },
    {
      name: 'Monday Power Fit & Flare',
      description: 'Engineered in wrinkle-resistant ponte knit that contours effortlessly. Features a square neck and sculpted pleats for confident poise.',
      category: hustlease._id,
      price: 2899,
      salePrice: 2199,
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Wine Berry', 'Jet Black'],
      stock: 35,
      featured: true,
      images: [
        'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=800&auto=format&fit=crop&q=80',
      ],
      specs: {
        fabric: 'Heavy Ponte Roma Stretch',
        fit: 'Fit and Flare',
        occasion: 'Office & Events',
        washCare: 'Machine wash gentle',
        neck: 'Square Neck',
        sleeveLength: 'Elbow Length',
        sleeveType: 'Fitted',
        pattern: 'Solid',
      },
    },
    {
      name: 'High-Waist Flared Trousers',
      description: 'Ultra-flattering silhouette with an elongated leg line, concealed waistband, and dynamic two-way stretch for all-day comfort.',
      category: hustlease._id,
      price: 2499,
      salePrice: 1849,
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Cocoa Brown', 'Obsidian Black'],
      stock: 8, // Low stock indicator test
      featured: false,
      images: [
        'https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&auto=format&fit=crop&q=80',
      ],
      specs: {
        fabric: 'Poly-Viscose Elastane',
        fit: 'High-Rise Flared',
        occasion: 'Executive & Daily Wear',
        washCare: 'Machine wash cold',
        neck: 'N/A',
        sleeveLength: 'N/A',
        sleeveType: 'N/A',
        pattern: 'Solid',
      },
    },
    {
      name: 'Ribbed Contour Knit Top',
      description: 'Luxe fine-gauge ribbed knit with a graceful sweetheart neckline. Fits like a glove beneath tailored jackets or on its own with trousers.',
      category: tops._id,
      price: 1499,
      salePrice: 1099,
      sizes: ['XS', 'S', 'M', 'L'],
      colors: ['Ivory Cream', 'Oatmeal Heather'],
      stock: 42,
      featured: false,
      images: [
        'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
      ],
      specs: {
        fabric: 'Rayon Viscose Ribbed Knit',
        fit: 'Slim Fitted',
        occasion: 'Smart Casual',
        washCare: 'Hand wash flat dry',
        neck: 'Sweetheart',
        sleeveLength: 'Short Sleeve',
        sleeveType: 'Cap',
        pattern: 'Fine Rib',
      },
    },
    {
      name: 'Pleated Satin Midi Skirt',
      description: 'Liquid sheen satin with accordion knife pleats that catch the light with every stride. Finished with an elasticized inner velvet waistband.',
      category: hustlease._id,
      price: 2299,
      salePrice: 1749,
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Champagne Gold', 'Emerald Forest'],
      stock: 22,
      featured: false,
      images: [
        'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80',
      ],
      specs: {
        fabric: 'High Density Heavy Satin',
        fit: 'Midi Flared',
        occasion: 'Cocktail & Evening',
        washCare: 'Dry clean recommended',
        neck: 'N/A',
        sleeveLength: 'N/A',
        sleeveType: 'N/A',
        pattern: 'Sunray Pleated',
      },
    },
    {
      name: 'Single-Breasted Sculpted Vest',
      description: 'Modern power dressing reimagined. Tailored darts, horn-effect buttons, and an adjustable back cinch.',
      category: hustlease._id,
      price: 1899,
      salePrice: 1399,
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Camel Beige', 'Midnight Black'],
      stock: 14,
      featured: false,
      images: [
        'https://images.unsplash.com/photo-1487222477460-f4476524eaf8?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1508427953056-b00b8d78ebf5?w=800&auto=format&fit=crop&q=80',
      ],
      specs: {
        fabric: 'Structured Suiting Fabric',
        fit: 'Tailored Waist',
        occasion: 'Formal & Layering',
        washCare: 'Dry clean',
        neck: 'Deep V-Neck',
        sleeveLength: 'Sleeveless',
        sleeveType: 'Vest',
        pattern: 'Solid Suiting',
      },
    },
    {
      name: 'Monochrome Linen Duo Set',
      description: 'Relaxed drop-shoulder button blouse paired with pleated elastic-back palazzo trousers. The pinnacle of breathable luxury.',
      category: coords._id,
      price: 3699,
      salePrice: 2899,
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Sage Olive', 'Ivory White'],
      stock: 19,
      featured: true,
      images: [
        'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80',
      ],
      specs: {
        fabric: 'European Pure Linen',
        fit: 'Easy Relaxed',
        occasion: 'Vacation & Casual Friday',
        washCare: 'Cold wash gentle',
        neck: 'Camp Collar',
        sleeveLength: 'Half Sleeve',
        sleeveType: 'Drop Shoulder',
        pattern: 'Natural Slub',
      },
    },
    {
      name: 'Ivy Thumbhole Mock-Neck',
      description: 'Second-skin thermal blend jersey with ergonomic thumbholes and seamless comfort. Ideal for crisp morning commutes.',
      category: tops._id,
      price: 1399,
      salePrice: 999,
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Deep Olive', 'Pitch Black'],
      stock: 50,
      featured: false,
      images: [
        'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80',
      ],
      specs: {
        fabric: 'Modal Microfiber Spandex',
        fit: 'Body Contouring',
        occasion: 'Layering & Daily Casual',
        washCare: 'Machine wash cold',
        neck: 'Mock Turtle Neck',
        sleeveLength: 'Full Sleeve',
        sleeveType: 'Thumbhole Extended Sleeve',
        pattern: 'Seamless Micro-Rib',
      },
      sizeChart: [
        { size: 'XS', bust: 32, waist: 26, hip: 35.5 },
        { size: 'S', bust: 34, waist: 28, hip: 37.5 },
        { size: 'M', bust: 36, waist: 30, hip: 39.5 },
        { size: 'L', bust: 38, waist: 32, hip: 42 },
        { size: 'XL', bust: 40, waist: 34, hip: 44 },
        { size: 'XXL', bust: 42, waist: 36, hip: 46 },
      ],
    },
  ];

  for (const p of sampleProducts) {
    await Product.create({
      ...p,
      slug: p.name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-') + '-' + Date.now().toString().slice(-4),
    });
  }

  // Create admin user
  let admin = await User.findOne({ email: 'admin@example.com' });
  if (!admin) {
    admin = await User.create({
      name: 'Aurelle Admin',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
    });
    console.log('👤 Default admin created: admin@example.com / admin123');
  } else {
    admin.role = 'admin';
    await admin.save();
  }

  // Create demo customer user for testing
  let demoCustomer = await User.findOne({ email: 'customer@example.com' });
  if (!demoCustomer) {
    demoCustomer = await User.create({
      name: 'Sophia Patel',
      email: 'customer@example.com',
      password: 'password123',
      role: 'customer',
      phone: '+91 98765 43210',
      address: {
        line1: '402, Lotus Grand, Indiranagar',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560038',
      },
    });
  }

  console.log('✅ Seed data inserted successfully with high-resolution fashion imagery.');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
