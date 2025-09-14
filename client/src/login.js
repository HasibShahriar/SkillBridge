// client/src/login.js
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import './login.css';
import api from './api';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    console.log("Input change:", e.target.name, e.target.value); // Debug input
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    console.log("Sending login request with data:", formData);
    const res = await api.post("/api/user/login", formData);
    
    // Debug the response
    console.log("Full response:", res.data);
    
    const { token, user, message } = res.data;
    
    // Check if token actually exists and is valid
    if (!token || token === 'undefined' || typeof token !== 'string') {
      console.error("Invalid token received:", token);
      setMessage("Login failed: Invalid token received");
      return;
    }
    
    if (!user || !user._id) {
      console.error("Invalid user received:", user);
      setMessage("Login failed: Invalid user data received");
      return;
    }

    // Store only if valid
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    
    // Verify storage worked
    console.log("Stored token:", localStorage.getItem("token"));
    console.log("Stored user:", localStorage.getItem("user"));
    
    setMessage(message || "Login successful!");
    onLogin(user);
    navigate(`/dashboard/${user._id}`, { replace: true });
    
  } catch (error) {
    console.error("Login error:", error.response?.data);
    setMessage(error.response?.data?.message || "Login failed");
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <div className="form-container">
      <form className="modern-form" onSubmit={handleSubmit}>
        <h2 className="form-title">Login to Your Account</h2>
        <div className="input-group">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="form-input"
            placeholder="Email Address"
            disabled={isSubmitting}
          />
        </div>
        <div className="input-group">
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="form-input"
            placeholder="Password"
            disabled={isSubmitting}
          />
        </div>
        {message && <div className="message">{message}</div>}
        <button
          type="submit"
          className="submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
        <div className="toggle-form">
          <p>
            Don't have an account?{" "}
            <button
              type="button"
              className="toggle-button"
              onClick={() => navigate("/register")}
            >
              Register here
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;