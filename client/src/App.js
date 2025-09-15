// App.js
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import NavigationBar from "./navigation_bar";

import Login from "./login";
import Register from "./register";
import UserProfile from "./components/UserProfile"; 
import Dashboard from "./components/Dashboard";  
import Courses from "./components/Courses"; 
import Networks from "./components/Networks";     
import Home from './components/home';       

const ProtectedRoute = ({ user }) => {
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
};

const PublicRoute = ({ user }) => {
  if (user) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
};

const ContainerWrapper = ({ children }) => (
  <div className="container my-4">
    {children}
  </div>
);

function App() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  const handleLogin = (userObj) => {
    setUser(userObj);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <BrowserRouter>
      <NavigationBar user={user} onLogout={handleLogout} />
      
      <Routes>
        {/* Public pages */}
        <Route element={<PublicRoute user={user} />}>
          <Route path="/login" element={<ContainerWrapper><Login onLogin={handleLogin} /></ContainerWrapper>} />
          <Route path="/register" element={<ContainerWrapper><Register onLogin={handleLogin} /></ContainerWrapper>} />
        </Route>

        <Route path="/" element={<Home />} />
        
        {/* Other pages with container */}
        <Route path="/profile" element={<ContainerWrapper><UserProfile /></ContainerWrapper>} />
        <Route path="/dashboard" element={<ContainerWrapper><Dashboard /></ContainerWrapper>} />
        <Route path="/networks" element={<ContainerWrapper><Networks /></ContainerWrapper>} />
        <Route path="/courses" element={<Courses />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;