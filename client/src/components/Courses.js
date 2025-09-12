// Courses.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Courses.css';

function Courses() {
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [userId, setUserId] = useState(null);

  // Get userId from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?._id) { // Fixed: use _id instead of id
      setUserId(user._id);
    }
  }, []);

  // Fetch all courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/courses');
        setCourses(res.data);
      } catch (err) {
        console.error('Error fetching courses:', err);
      }
    };
    fetchCourses();
  }, []);

  // Fetch enrolled courses for this user
  useEffect(() => {
    if (!userId) return;

    const fetchEnrolledCourses = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(
          `http://localhost:5000/api/courses/user/enrolled?userId=${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setEnrolledCourses(res.data.enrolledCourses.map(course => course._id));
      } catch (err) {
        console.error('Error fetching enrolled courses:', err);
      }
    };
    fetchEnrolledCourses();
  }, [userId]);

  // Enroll user in a course
  const enrollCourse = async (courseId) => {
    if (!userId) {
      alert('Please log in to enroll.');
      return;
    }
    if (enrolledCourses.includes(courseId)) {
      alert('Already enrolled in this course.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:5000/api/courses/enroll',
        { userId, courseId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEnrolledCourses([...enrolledCourses, courseId]);
      alert(res.data.message);
    } catch (err) {
      console.error('Error enrolling in course:', err);
      alert(err.response?.data?.message || 'Failed to enroll.');
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
