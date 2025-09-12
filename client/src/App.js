// client/src/App.js
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import NavigationBar from './navigation_bar';
import Courses from './components/Courses';
import Dashboard from './components/Dashboard';
import Home from './components/home';
import Networks from './components/Networks';
import Login from './login';
import Register from './register';
import OpportunityPage from './components/OpportunityPage'; // <-- new page
import AdminOpportunities from "./components/AdminOpportunities";


function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData, token) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  // Protected Route wrapper
  const ProtectedRoute = ({ children }) => {
    if (loading) return <p>Loading...</p>;
    if (!user) return <Navigate to="/login" replace />;
    return children;
  };

  if (loading) return <p>Loading...</p>;

  return (
    <BrowserRouter>
      {user && <NavigationBar user={user} onLogout={handleLogout} />}
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/login"
          element={
            user ? <Navigate to={`/dashboard/${user._id || user.id}`} replace /> : <Login onLogin={handleLogin} />
          }
        />

        <Route
          path="/register"
          element={
            user ? <Navigate to={`/dashboard/${user._id || user.id}`} replace /> : <Register onLogin={handleLogin} />
          }
        />

        <Route
          path="/dashboard/:userId"
          element={
            <ProtectedRoute>
              <Dashboard user={user} />
            </ProtectedRoute>
          }
        />

        {/* Redirect /dashboard to user's dashboard */}
        <Route
          path="/dashboard"
          element={user ? <Navigate to={`/dashboard/${user._id || user.id}`} replace /> : <Navigate to="/login" replace />}
        />

        <Route path="/courses" element={<Courses />} />
        <Route path="/networks" element={<Networks />} />

        {/* Opportunities page */}
        <Route path="/opportunities" element={<OpportunityPage />} />

        
        
        <Route
  path="/admin/opportunities"
  element={
    <ProtectedRoute>
      {user?.role === "admin" ? <AdminOpportunities /> : <p>Access Denied</p>}
    </ProtectedRoute>
  }
/>


        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
