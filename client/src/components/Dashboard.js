import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

function Dashboard({ user }) {
  const navigate = useNavigate();
  const { userId } = useParams(); // Get userId from URL params
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Don't redirect here - let App.js handle authentication
    if (!user) {
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Debug: fetch all users first (optional - remove in production)
        try {
          const allUsersRes = await axios.get('http://localhost:5000/api/dashboard/debug/all-users');
          console.log('All users from DB:', allUsersRes.data);
        } catch (debugError) {
          console.warn('Debug route failed (this is okay):', debugError.message);
        }

        // Use the user ID from props (since URL params is undefined)
        const targetUserId = user._id || user.id;
        
        console.log('Using user ID:', targetUserId);
        
        // Fetch the dashboard data
        const token = localStorage.getItem('token');
        console.log('Token exists:', !!token);
        console.log('Making request to:', `http://localhost:5000/api/dashboard/${targetUserId}`);
        
        const res = await axios.get(`http://localhost:5000/api/dashboard/${targetUserId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log('Dashboard response:', res.data);
        
        setDashboardData(res.data);
      } catch (error) {
        console.error('Error fetching dashboard:', error);
        setError(error.response?.data?.message || 'Failed to load dashboard data');
        
        // Only redirect on authentication errors, not general errors
        if (error.response?.status === 401) {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          navigate('/login', { replace: true });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, userId, navigate]); // Include userId in dependencies

  if (!user) {
    return <p>Please log in to view your dashboard.</p>;
  }

  if (loading) {
    return <div className="dashboard-container"><p>Loading user info...</p></div>;
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <h2>Dashboard Error</h2>
        <p style={{ color: 'red' }}>{error}</p>
        <p>User ID from URL: {userId}</p>
        <p>User ID from props: {user._id || user.id}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  if (!dashboardData) {
    return <div className="dashboard-container"><p>No dashboard data available.</p></div>;
  }

  return (
    <div className="dashboard-container">
      <h1>Welcome, {dashboardData.firstname} {dashboardData.lastname}</h1>
      <p><strong>Email:</strong> {dashboardData.email}</p>
      {dashboardData.bio && <p><strong>Bio:</strong> {dashboardData.bio}</p>}
      <p>Enrolled Courses: {dashboardData.enrolledCourses?.length || 0}</p>
    </div>
  );
}

export default Dashboard;