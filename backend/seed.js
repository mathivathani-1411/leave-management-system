// seed.js - Seed demo users
const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const demoUsers = [
  {
    name: 'Demo Student',
    email: 'student@demo.com',
    password: 'demo123',
    role: 'student'
  },
  {
    name: 'Demo Teacher',
    email: 'teacher@demo.com',
    password: 'demo123',
    role: 'teacher'
  },
  {
    name: 'Demo HOD',
    email: 'hod@demo.com',
    password: 'demo123',
    role: 'hod'
  },
  {
    name: 'Demo Principal',
    email: 'principal@demo.com',
    password: 'demo123',
    role: 'principal'
  }
];

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    for (const userData of demoUsers) {
      const existingUser = await User.findOne({ email: userData.email });
      if (!existingUser) {
        await User.create(userData);
        console.log(`Created user: ${userData.email}`);
      } else {
        console.log(`User already exists: ${userData.email}`);
      }
    }

    console.log('Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedUsers();