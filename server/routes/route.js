// server/routes/route.js
import express from 'express';
import { loginUser, newUser } from '../controllers/userController.js';

const router = express.Router();

router.post('/login', loginUser);
router.post('/register', newUser);

export default router;