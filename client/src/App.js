import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import React, {useState, useEffect} from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NavigationBar from "./navigation_bar";

import Courses from "./components/Courses";
import Dashboard from "./components/Dashboard";
import Home from "./components/home";
import Networks from "./components/Networks"; 
import Login from "./login";
import Register from "./register";

function App() {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(true);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);  
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const ProtectedRoute = ({ children }) => {
    if (loading) {
      return <div>Loading...</div>;
    }
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <BrowserRouter>
      <div className="App">
        {user && <NavigationBar user={user} onLogout={handleLogout} />}
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path='/login' element={
            user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              showLogin ? (
                <Login onLogin={handleLogin} onSwitchToRegister={() => setShowLogin(false)} />
              ) : (
                <Register onLogin={handleLogin} onSwitchToLogin={() => setShowLogin(true)} />
              )
            )
          } />
          <Route path='/register' element={<Register onLogin={handleLogin} />} />
          <Route path='/dashboard' element={
            <ProtectedRoute>
              <Dashboard user={user} />
            </ProtectedRoute>
          } />
          <Route path="/courses" element={<Courses/>} />
          <Route path="/networks" element={<Networks/>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;