import express from 'express';
import Opportunity from '../models/Opportunity.js';
import { protect, adminMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET all opportunities (public)
router.get('/', async (req, res) => {
  try {
    const opportunities = await Opportunity.find().sort({ createdAt: -1 });
    res.json(opportunities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create opportunity (admin only)
router.post('/', protect, adminMiddleware, async (req, res) => {
  try {
    const opp = await Opportunity.create(req.body);
    res.status(201).json(opp);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE opportunity (admin only)
router.delete('/:id', protect, adminMiddleware, async (req, res) => {
  try {
    await Opportunity.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
