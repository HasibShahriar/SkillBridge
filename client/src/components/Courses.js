import React, { useState, useEffect } from 'react';
import axios from "axios";
import './Courses.css';

function Courses() {
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  // Fetch courses from backend
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/courses");
        setCourses(res.data);
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };
    fetchCourses();
  }, []);

  // Enroll into a course (frontend only for now)
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
        {courses.length === 0 ? (
          <p>No courses available. Please add some from backend.</p>
        ) : (
          courses.map(course => (
            <div key={course._id} className="course-card">
              <h3>{course.title}</h3>
              <p>{course.description}</p>

              <div className="progress-bar">
                <div
                  className="progress"
                  style={{ width: `${course.progress || 0}%` }}
                ></div>
              </div>
              <p className="progress-text">{course.progress || 0}% completed</p>

              <button
                className={enrolledCourses.includes(course._id) ? 'enrolled' : 'enroll-btn'}
                onClick={() => enrollCourse(course._id)}
                disabled={enrolledCourses.includes(course._id)}
              >
                {enrolledCourses.includes(course._id) ? 'Enrolled' : 'Enroll'}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Courses;
