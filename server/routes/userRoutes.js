import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// POST /api/user/register
router.post('/register', async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user (password hashed in schema pre-save hook)
    const user = await User.create({ firstname, lastname, email, password });

    // Exclude password from response
    const { password: pwd, ...userWithoutPassword } = user.toObject();

    res.status(201).json({ user: userWithoutPassword });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});
// POST /api/user/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    // Compare password using schema method
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Exclude password from response
    const { password: pwd, ...userWithoutPassword } = user.toObject();

    // Send token + user to frontend
    res.json({
      message: "Login successful",
      user: userWithoutPassword,
      token, // <-- this is critical
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});


export default router;
