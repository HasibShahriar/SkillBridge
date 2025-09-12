import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const makeAdmin = async (email) => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      process.exit(1);
    }

    user.role = 'admin';
    await user.save(); // This ensures pre-save hooks run if needed
    console.log('✅ User is now admin:', user.email, 'Role:', user.role);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Call the function with the email of the user you want to promote
makeAdmin('adnann@gmail.com');
