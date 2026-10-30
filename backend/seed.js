const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./model/User');
const Product = require('./model/Product');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await User.deleteMany();
    await Product.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@shopnest.com',
      password: hashedPassword,
      role: 'admin',
      verified: true
    });

    const products = [
      // ---------- Electronics ----------
      {
        name: 'Wireless Noise-Cancelling Headphones',
        description: 'Immersive sound experience with advanced active noise cancellation.',
        price: 299.99,
        category: 'Electronics',
        stock: 15,
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.8,
        numReviews: 24
      },
      {
        name: 'Professional DSLR Camera',
        description: 'Capture stunning moments with high-resolution clarity and speed.',
        price: 1199.99,
        category: 'Electronics',
        stock: 8,
        imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.9,
        numReviews: 50
      },
      {
        name: 'Smart Fitness Watch',
        description: 'Track workouts, heart rate, and sleep with a sleek always-on display.',
        price: 199.99,
        category: 'Electronics',
        stock: 40,
        imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.4,
        numReviews: 63
      },
      {
        name: 'Portable Bluetooth Speaker',
        description: 'Rich, room-filling sound in a compact, waterproof design.',
        price: 79.99,
        category: 'Electronics',
        stock: 60,
        imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.3,
        numReviews: 41
      },
      {
        name: '4K Ultra HD Smart TV 55"',
        description: 'Cinematic visuals with vibrant colors and smart streaming built-in.',
        price: 649.99,
        category: 'Electronics',
        stock: 12,
        imageUrl: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.6,
        numReviews: 35
      },

      // ---------- Furniture ----------
      {
        name: 'Minimalist Modern Chair',
        description: 'A stylish and comfortable addition to any contemporary living room.',
        price: 150.00,
        category: 'Furniture',
        stock: 30,
        imageUrl: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.2,
        numReviews: 12
      },
      {
        name: 'Wooden Coffee Table',
        description: 'Solid oak coffee table with a warm natural finish.',
        price: 220.00,
        category: 'Furniture',
        stock: 18,
        imageUrl: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.5,
        numReviews: 19
      },
      {
        name: 'Cozy 3-Seater Sofa',
        description: 'Plush cushioning and durable fabric for everyday comfort.',
        price: 780.00,
        category: 'Furniture',
        stock: 10,
        imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.7,
        numReviews: 28
      },

      // ---------- Clothing ----------
      {
        name: 'Classic White Sneakers',
        description: 'Versatile and comfortable, a staple for any casual outfit.',
        price: 85.00,
        category: 'Clothing',
        stock: 50,
        imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.5,
        numReviews: 89
      },
      {
        name: 'Men\'s Slim Fit Denim Jacket',
        description: 'Rugged denim with a modern tailored silhouette.',
        price: 95.00,
        category: 'Clothing',
        stock: 35,
        imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.3,
        numReviews: 22
      },
      {
        name: 'Women\'s Summer Floral Dress',
        description: 'Lightweight, breathable fabric perfect for warm days.',
        price: 65.00,
        category: 'Clothing',
        stock: 45,
        imageUrl: 'https://images.unsplash.com/photo-1495385794356-15371f348c31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.6,
        numReviews: 37
      },

      // ---------- Accessories ----------
      {
        name: 'Leather Wallet',
        description: 'Handcrafted genuine leather wallet with multiple card slots.',
        price: 45.00,
        category: 'Accessories',
        stock: 70,
        imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.4,
        numReviews: 31
      },
      {
        name: 'Aviator Sunglasses',
        description: 'UV-protected polarized lenses with a timeless metal frame.',
        price: 59.99,
        category: 'Accessories',
        stock: 55,
        imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.2,
        numReviews: 18
      },
      {
        name: 'Stainless Steel Analog Watch',
        description: 'Elegant everyday watch with a scratch-resistant sapphire face.',
        price: 129.99,
        category: 'Accessories',
        stock: 25,
        imageUrl: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.7,
        numReviews: 44
      },

      // ---------- Home & Kitchen ----------
      {
        name: 'Ceramic Coffee Mug Set (4-Pack)',
        description: 'Elegant matte-finish mugs, dishwasher and microwave safe.',
        price: 29.99,
        category: 'Home & Kitchen',
        stock: 80,
        imageUrl: 'https://images.unsplash.com/photo-1481833761820-0509d3217039?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.5,
        numReviews: 27
      },
      {
        name: 'Stainless Steel Cookware Set',
        description: '10-piece set built for even heating and long-lasting durability.',
        price: 249.99,
        category: 'Home & Kitchen',
        stock: 14,
        imageUrl: 'https://images.unsplash.com/photo-1584990347449-a2d4c4b64b3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.6,
        numReviews: 33
      },

      // ---------- Sports & Outdoors ----------
      {
        name: 'Yoga Mat with Carry Strap',
        description: 'Non-slip, extra-cushioned mat for all levels of practice.',
        price: 34.99,
        category: 'Sports & Outdoors',
        stock: 65,
        imageUrl: 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.4,
        numReviews: 29
      },
      {
        name: 'Adjustable Dumbbell Set',
        description: 'Space-saving dumbbells with quick weight adjustment.',
        price: 189.99,
        category: 'Sports & Outdoors',
        stock: 20,
        imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.5,
        numReviews: 21
      }
    ];

    await Product.insertMany(products);

    console.log('✅ Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`❌ Error with data import: ${error.message}`);
    process.exit(1);
  }
};

importData();