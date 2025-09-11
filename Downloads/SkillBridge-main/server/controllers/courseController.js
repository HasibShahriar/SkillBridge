import Course from "../models/Course.js";
import User from "../models/User.js";

// Get all courses
export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new course
export const addCourse = async (req, res) => {
  try {
    const { title, description } = req.body;
    const course = new Course({ title, description });
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update course progress
export const updateProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const { progress } = req.body;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid course ID" });
    }
    const course = await Course.findByIdAndUpdate(
      id,
      { progress },
      { new: true }
    );
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Enroll a user in a course
export const enrollCourse = async (req, res) => {
  try {
    const { userId, courseId } = req.body;
    if (!mongoose.isValidObjectId(userId) || !mongoose.isValidObjectId(courseId)) {
      return res.status(400).json({ message: "Invalid user or course ID" });
    }
    const user = await User.findById(userId);
    const course = await Course.findById(courseId);
    if (!user || !course) {
      return res.status(404).json({ message: "User or course not found" });
    }
    if (user.enrolledCourses.includes(courseId)) {
      return res.status(400).json({ message: "Already enrolled in this course" });
    }
    user.enrolledCourses.push(courseId);
    await user.save();
    res.status(200).json({ message: "Enrolled successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};