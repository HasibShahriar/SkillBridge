import express from 'express';
import { getOpportunities, addOpportunity, deleteOpportunity } from '../controllers/opportunityController.js';

const router = express.Router();

// Public routes
router.get('/', getOpportunities);

// Admin routes (or authenticated users)
router.post('/', addOpportunity);
router.delete('/:id', deleteOpportunity);

export default router;
