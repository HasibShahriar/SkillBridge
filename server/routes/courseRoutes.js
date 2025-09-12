// server/routes/courseRoutes.js
import express from 'express';
import { getCourses, addCourse, updateProgress, enrollCourse, getEnrolledCourses } from '../controllers/courseController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getCourses); // GET /api/courses
router.post('/', addCourse); // POST /api/courses
router.put('/:id/progress', updateProgress); // PUT /api/courses/:id/progress
router.post('/enroll', authMiddleware, enrollCourse); // POST /api/courses/enroll
router.get('/user/enrolled', authMiddleware, getEnrolledCourses); // GET /api/courses/user/enrolled

export default router;