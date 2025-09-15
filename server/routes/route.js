// server/routes/route.js
import express from 'express';
import { loginUser, newUser, getProfile, updateProfile } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js'; // Fixed: import 'protect' instead of 'authMiddleware'

const router = express.Router();

// Public routes
router.post('/login', loginUser);
router.post('/register', newUser);

// Protected routes - using 'protect' middleware
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

export default router;