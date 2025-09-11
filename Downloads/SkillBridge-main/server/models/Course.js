import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    progress: { type: Number, default: 0 }
});

const Course = mongoose.model("Course", courseSchema);

export default Course;
