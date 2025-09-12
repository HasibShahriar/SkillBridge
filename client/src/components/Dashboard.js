import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

function Dashboard({ user }) {
  const navigate = useNavigate();
  const { userId } = useParams(); 
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const targetUserId = user._id || user.id;
        const token = localStorage.getItem('token');

        const res = await axios.get(`http://localhost:5000/api/dashboard/${targetUserId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setDashboardData(res.data);
      } catch (err) {
        console.error('Error fetching dashboard:', err);
        setError(err.response?.data?.message || 'Failed to load dashboard data');

        if (err.response?.status === 401) {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          navigate('/login', { replace: true });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, userId, navigate]);

  if (!user) return <p>Please log in to view your dashboard.</p>;

  if (loading) return <div className="dashboard-container"><p>Loading dashboard...</p></div>;

  if (error) return (
    <div className="dashboard-container">
      <h2>Dashboard Error</h2>
      <p style={{ color: 'red' }}>{error}</p>
      <p>User ID from URL: {userId}</p>
      <p>User ID from props: {user._id || user.id}</p>
      <button onClick={() => window.location.reload()}>Retry</button>
    </div>
  );

  if (!dashboardData) return <div className="dashboard-container"><p>No dashboard data available.</p></div>;

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <h1>Welcome, {dashboardData.firstname} {dashboardData.lastname}</h1>
        <p><strong>Email:</strong> {dashboardData.email}</p>
        {dashboardData.bio && <p className="bio">{dashboardData.bio}</p>}
      </header>

      {/* Stats */}
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

      {/* Courses */}
      <section className="courses-section">
        <h2>My Courses</h2>
        {dashboardData.enrolledCourses && dashboardData.enrolledCourses.length > 0 ? (
          <div className="cards-container">
            {dashboardData.enrolledCourses.map(course => (
              <div className="course-card" key={course._id}>
                <h4>{course.title}</h4>
                <p>{course.description || "No description provided."}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No enrolled courses yet. Explore and enroll now!</p>
        )}
      </section>
    </div>
  );
}

export default Dashboard;
