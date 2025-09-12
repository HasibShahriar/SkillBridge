import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const adminData = {
      firstname: "Admin",
      lastname: "User",
      email: "admin@gmail.com",
      password: "asdfasdf", // plain text password; schema will hash
      role: "admin",
      isActive: true,
    };

    // Check if admin exists
    let admin = await User.findOne({ email: adminData.email });

    if (admin) {
      console.log("⚠️ Admin exists. Updating role and re-hashing password.");

      // Assign new values and save via schema
      admin.role = "admin";
      admin.password = adminData.password; // schema pre-save will hash
      await admin.save(); // <-- triggers pre-save hook
      console.log("✅ Admin updated successfully");
    } else {
      // Create new admin (pre-save hook hashes password)
      admin = await User.create(adminData);
      console.log("✅ Admin created successfully");
    }

    console.log("Email:", adminData.email);
    console.log("Password:", adminData.password);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

createAdmin();
