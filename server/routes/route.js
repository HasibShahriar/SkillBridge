import express from "express";
import { loginUser, newUser } from '../controllers/userController.js';
const router = express.Router();

router.post('/',loginUser);
router.post('/',newUser);

export default router;