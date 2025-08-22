import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css'; // We'll define some simple CSS for layout

function Dashboard() {
  const { userId } = useParams();
  const [data, setData] = useState({ courses: [], opportunities: [] });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:5000/dashboard/${userId}`)
      .then(response => setData(response.data))
      .catch(error => console.error('Error fetching dashboard:', error));
  }, [userId]);

  // Filter courses and opportunities based on search term
  const filteredCourses = data.courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOpportunities = data.opportunities.filter(opportunity =>
    opportunity.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome, User {userId}</h1>
        <input
          type="text"
          placeholder="Search courses or opportunities..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </header>

      <section className="stats-section">
        <div className="stat-card">
          <h3>Total Courses</h3>
          <p>{data.courses.length}</p>
        </div>
        <div className="stat-card">
          <h3>Total Opportunities</h3>
          <p>{data.opportunities.length}</p>
        </div>
      </section>

      <section className="courses-section">
        <h2>My Courses</h2>
        <div className="cards-container">
          {filteredCourses.map(course => (
            <div key={course._id} className="course-card">
              <h4>{course.title}</h4>
              <p>{course.description}</p>
              <div className="progress-bar">
                <div
                  className="progress"
                  style={{ width: `${course.progress || 0}%` }}
                ></div>
              </div>
              <p>{course.progress || 0}% completed</p>
            </div>
          ))}
          {filteredCourses.length === 0 && <p>No courses found.</p>}
        </div>
      </section>

      <section className="opportunities-section">
        <h2>Opportunities</h2>
        <div className="cards-container">
          {filteredOpportunities.map(opportunity => (
            <div key={opportunity._id} className="opportunity-card">
              <h4>{opportunity.title}</h4>
              <p><strong>Company:</strong> {opportunity.company}</p>
              <p><strong>Location:</strong> {opportunity.location}</p>
              <p><strong>Deadline:</strong> {opportunity.deadline || 'N/A'}</p>
            </div>
          ))}
          {filteredOpportunities.length === 0 && <p>No opportunities found.</p>}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
