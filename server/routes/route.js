import express from "express";
import { getUser, newUser } from '../controllers/userController.js';
const router = express.Router();

router.get('/', getUser);
router.post('/',newUser);

export default router;