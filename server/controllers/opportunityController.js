import Opportunity from '../models/Opportunity.js';
import mongoose from 'mongoose';

// Get all opportunities
export const getOpportunities = async (req, res) => {
  try {
    const opportunities = await Opportunity.find().sort({ createdAt: -1 });
    res.status(200).json(opportunities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add a new opportunity
export const addOpportunity = async (req, res) => {
  try {
    const { title, type, description, link, deadline, postedBy } = req.body;
    const opportunity = new Opportunity({ title, type, description, link, deadline, postedBy });
    await opportunity.save();
    res.status(201).json(opportunity);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete an opportunity
export const deleteOpportunity = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid ID' });

    const opportunity = await Opportunity.findByIdAndDelete(id);
    if (!opportunity) return res.status(404).json({ message: 'Opportunity not found' });

    res.status(200).json({ message: 'Opportunity deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
