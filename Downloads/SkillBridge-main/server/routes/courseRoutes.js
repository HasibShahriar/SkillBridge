import express from "express";
import { getCourses, addCourse, updateProgress, enrollCourse } from "../controllers/courseController.js";

const router = express.Router();

router.get("/", getCourses);
router.post("/", addCourse);
router.patch("/:id/progress", updateProgress);
router.post("/enroll", enrollCourse); // New enrollment endpoint

export default router;