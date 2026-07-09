const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const User = require('../models/User');

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      console.error('ERROR: ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env');
      process.exit(1);
    }

    console.log(`Checking for admin user: ${email}...`);


    let admin = await User.findOne({ email });

    if (admin) {
      console.log('Admin user already exists.');
      // Ensure role is admin
      if (admin.role !== 'admin') {
        admin.role = 'admin';
        await admin.save();
        console.log('Updated existing user role to admin.');
      }
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      admin = new User({
        name: 'System Admin',
        email,
        password: hashedPassword,
        role: 'admin'
      });

      await admin.save();
      console.log('Admin user successfully created.');
    }

    await mongoose.connection.close();
    console.log('Seeding completed. Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding admin: ${error.message}`);
    process.exit(1);
  }
};

seedAdmin();
