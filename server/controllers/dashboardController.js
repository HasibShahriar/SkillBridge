// client/src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

function Dashboard({ user }) {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return; // ProtectedRoute ensures login

    const actualUserId = user._id || user.id;

    // If URL is wrong, redirect to correct dashboard URL
    if (userId !== actualUserId) {
      navigate(`/dashboard/${actualUserId}`, { replace: true });
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/dashboard/${actualUserId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDashboardData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, userId, navigate]);

  if (loading) return <p>Loading dashboard...</p>;
  if (!dashboardData) return <p>No user data found</p>;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome, {dashboardData.firstname} {dashboardData.lastname}</h1>
        <p><strong>Email:</strong> {dashboardData.email}</p>
        {dashboardData.bio && <p><strong>Bio:</strong> {dashboardData.bio}</p>}
      </header>

      <section className="stats-section">
        <div className="stat-card">
          <h3>Enrolled Courses</h3>
          <p>{dashboardData.enrolledCourses?.length || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Account Created</h3>
          <p>{new Date(dashboardData.createdAt).toLocaleDateString()}</p>
        </div>
      </section>

      <section className="courses-section">
        <h2>My Courses</h2>
        {dashboardData.enrolledCourses && dashboardData.enrolledCourses.length > 0 ? (
          <ul>
            {dashboardData.enrolledCourses.map(course => (
              <li key={course._id}>
                {course.title} - {course.description} ({course.progress || 0}% completed)
              </li>
            ))}
          </ul>
        ) : (
          <p>No enrolled courses.</p>
        )}
      </section>
    </div>
  );
}

export default Dashboard;
