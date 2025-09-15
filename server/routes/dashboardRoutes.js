import express from 'express';
import User from '../models/User.js';
import Course from '../models/Course.js';

const router = express.Router();

// Debug route
router.get("/debug/all-users", async (req, res) => {
  try {
    const users = await User.find({}, "_id firstname lastname email").lean();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Normal dashboard route
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId).populate("enrolledCourses", "title description progress");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user.getPublicProfile());
});

export default router;
