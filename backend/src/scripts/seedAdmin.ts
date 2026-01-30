import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { connectMongo } from '../config/mongo';

const seedAdmin = async () => {
  try {
    await connectMongo();
    console.log('Connected to MongoDB');

    const adminEmail = 'admin@ayurai.com';
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('Admin user already exists. Updating password...');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      existingAdmin.password = hashedPassword;
      // Ensure role is admin
      existingAdmin.role = 'admin';
      await existingAdmin.save();
      console.log('Admin user password and role updated successfully');
      console.log('Email: admin@ayurai.com');
      console.log('Password: admin123');
      return;
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);

    const adminUser = new User({
      name: 'Admin User',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
    });

    await adminUser.save();
    console.log('Admin user created successfully');
    console.log('Email: admin@ayurai.com');
    console.log('Password: admin123');

  } catch (error) {
    console.error('Error seeding admin user:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
};

seedAdmin();
