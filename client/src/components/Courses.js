import React, { useState } from 'react';
import './Courses.css';

function Courses() {
  // Pre-filled course data
  const initialCourses = [
    { _id: '1', title: 'Web Development', description: 'Learn MERN stack', progress: 0 },
    { _id: '2', title: 'Data Structures & Algorithms', description: 'Master algorithms with C++', progress: 0 },
    { _id: '3', title: 'Python Programming', description: 'From beginner to advanced Python', progress: 0 },
    { _id: '4', title: 'Machine Learning', description: 'Introduction to ML and AI', progress: 0 },
    { _id: '5', title: 'Mathematics for CS', description: 'Discrete Math & Linear Algebra', progress: 0 },
    { _id: '6', title: 'Cybersecurity Basics', description: 'Learn ethical hacking & security', progress: 0 },
    { _id: '7', title: 'Cloud Computing', description: 'AWS, Azure fundamentals', progress: 0 },
    { _id: '8', title: 'Java Programming', description: 'Object-Oriented Programming with Java', progress: 0 },
    { _id: '9', title: 'React & Frontend', description: 'Build modern web apps using React', progress: 0 },
    { _id: '10', title: 'Communication Skills', description: 'Enhance professional communication', progress: 0 },
  ];

  const [courses, setCourses] = useState(initialCourses);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  // Enroll into a course
  const enrollCourse = (courseId) => {
    if (!enrolledCourses.includes(courseId)) {
      setEnrolledCourses([...enrolledCourses, courseId]);
      alert('Enrolled successfully!');
    } else {
      alert('Already enrolled in this course.');
    }
  };

  return (
    <div className="courses-container">
      <h1>Courses</h1>

      <div className="cards-container">
        {courses.map(course => (
          <div key={course._id} className="course-card">
            <h3>{course.title}</h3>
            <p>{course.description}</p>

            <div className="progress-bar">
              <div className="progress" style={{ width: `${course.progress}%` }}></div>
            </div>
            <p className="progress-text">{course.progress}% completed</p>

            <button
              className={enrolledCourses.includes(course._id) ? 'enrolled' : 'enroll-btn'}
              onClick={() => enrollCourse(course._id)}
              disabled={enrolledCourses.includes(course._id)}
            >
              {enrolledCourses.includes(course._id) ? 'Enrolled' : 'Enroll'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Courses;
