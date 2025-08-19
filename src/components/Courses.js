import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Courses.css'; // We'll create this CSS file

function Courses() {
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/courses')
      .then(response => setCourses(response.data))
      .catch(error => console.error('Error fetching courses:', error));
  }, []);

  const addCourse = () => {
    if (!title.trim() || !description.trim()) return;
    axios.post('http://localhost:5000/courses', { title, description })
      .then(response => {
        setCourses([...courses, response.data]);
        setTitle('');
        setDescription('');
      })
      .catch(error => console.error('Error adding course:', error));
  };

  return (
    <div className="courses-container">
      <h1>Courses</h1>

      {/* Add Course Form */}
      <div className="course-form">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Course Title"
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Course Description"
        />
        <button onClick={addCourse}>Add Course</button>
      </div>

      {/* Courses List */}
      <div className="cards-container">
        {courses.map(course => (
          <div key={course._id} className="course-card">
            <h3>{course.title}</h3>
            <p>{course.description}</p>
            {/* Placeholder progress bar */}
            <div className="progress-bar">
              <div className="progress" style={{ width: `${course.progress || 0}%` }}></div>
            </div>
            <p className="progress-text">{course.progress || 0}% completed</p>
          </div>
        ))}
        {courses.length === 0 && <p>No courses available yet.</p>}
      </div>
    </div>
  );
}

export default Courses;
