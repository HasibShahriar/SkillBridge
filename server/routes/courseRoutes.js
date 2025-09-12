import express from 'express';
import { getCourses, addCourse, enrollCourse, getEnrolledCourses } from '../controllers/courseController.js';

const router = express.Router();

router.get('/', getCourses);                // GET /api/courses
router.post('/', addCourse);               // POST /api/courses
router.post('/enroll', enrollCourse);      // POST /api/courses/enroll
router.get('/user/enrolled', getEnrolledCourses); // GET /api/courses/user/enrolled?userId=xxx

export default router;
