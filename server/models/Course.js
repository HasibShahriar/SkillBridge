// server/models/Course.js
import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  duration: Number,
  // add other fields if needed
});

const Course = mongoose.model('Course', courseSchema);
export default Course;
