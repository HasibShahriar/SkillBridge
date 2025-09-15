// App.js
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';

import NavigationBar from './navigation_bar';
import Login from './login';
import Register from './register';
import UserProfile from './components/UserProfile';
import Dashboard from './components/Dashboard';
import Courses from './components/Courses';
import Networks from './components/Networks';
import Home from './components/home';
import OpportunityPage from './components/OpportunityPage';
import AdminOpportunities from './components/AdminOpportunities';

// Protected Route wrapper - requires authentication
const ProtectedRoute = ({ user, children }) => {
  if (!user) return <Navigate to="/login" replace />;
  return children || <Outlet />;
};

// Public-only routes - redirects authenticated users to dashboard
const PublicRoute = ({ user }) => {
  if (user) return <Navigate to={`/dashboard/${user._id || user.id}`} replace />;
  return <Outlet />;
};

// Admin Route wrapper - requires admin role
const AdminRoute = ({ user, children }) => {
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <div className="alert alert-danger">Access Denied</div>;
  return children || <Outlet />;
};

// Container wrapper for pages that need Bootstrap container
const ContainerWrapper = ({ children }) => (
  <div className="container my-4">
    {children}
  </div>
);

function App() {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      localStorage.removeItem('user');
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  // Update localStorage when user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }, [user]);

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

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      {user && <NavigationBar user={user} onLogout={handleLogout} />}
      
      <Routes>
        {/* Home page - full width, no container */}
        <Route path="/" element={<Home />} />

        {/* Public-only routes - redirect if logged in */}
        <Route element={<PublicRoute user={user} />}>
          <Route 
            path="/login" 
            element={
              <ContainerWrapper>
                <Login onLogin={handleLogin} />
              </ContainerWrapper>
            } 
          />
          <Route 
            path="/register" 
            element={
              <ContainerWrapper>
                <Register onLogin={handleLogin} />
              </ContainerWrapper>
            } 
          />
        </Route>

        {/* Alternative login/register routes with direct checks */}
        <Route
          path="/login-alt"
          element={
            user ? (
              <Navigate to={`/dashboard/${user._id || user.id}`} replace />
            ) : (
              <ContainerWrapper>
                <Login onLogin={handleLogin} />
              </ContainerWrapper>
            )
          }
        />

        <Route
          path="/register-alt"
          element={
            user ? (
              <Navigate to={`/dashboard/${user._id || user.id}`} replace />
            ) : (
              <ContainerWrapper>
                <Register onLogin={handleLogin} />
              </ContainerWrapper>
            )
          }
        />

        {/* Protected routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute user={user}>
              <ContainerWrapper>
                <UserProfile />
              </ContainerWrapper>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/:userId"
          element={
            <ProtectedRoute user={user}>
              <ContainerWrapper>
                <Dashboard user={user} />
              </ContainerWrapper>
            </ProtectedRoute>
          }
        />

        {/* Dashboard redirect */}
        <Route
          path="/dashboard"
          element={
            user ? (
              <Navigate to={`/dashboard/${user._id || user.id}`} replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Public pages with container */}
        <Route 
          path="/courses" 
          element={
            <ContainerWrapper>
              <Courses />
            </ContainerWrapper>
          } 
        />
        
        <Route 
          path="/networks" 
          element={
            <ContainerWrapper>
              <Networks />
            </ContainerWrapper>
          } 
        />

        <Route 
          path="/opportunities" 
          element={
            <ContainerWrapper>
              <OpportunityPage />
            </ContainerWrapper>
          } 
        />

        {/* Admin routes */}
        <Route
          path="/admin/opportunities"
          element={
            <AdminRoute user={user}>
              <ContainerWrapper>
                <AdminOpportunities />
              </ContainerWrapper>
            </AdminRoute>
          }
        />

        {/* Alternative admin route with direct check */}
        <Route
          path="/admin/opportunities-alt"
          element={
            <ProtectedRoute user={user}>
              <ContainerWrapper>
                {user?.role === 'admin' ? (
                  <AdminOpportunities />
                ) : (
                  <div className="alert alert-danger">Access Denied</div>
                )}
              </ContainerWrapper>
            </ProtectedRoute>
          }
        />

        {/* Catch all fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;