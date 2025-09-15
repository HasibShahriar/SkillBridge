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
      
      // Try both API endpoints for compatibility
      let res;
      try {
        // First try with the relative path (using baseURL from api.js)
        res = await api.post("/api/user/login", formData);
      } catch (relativeError) {
        console.log("Relative path failed, trying absolute URL:", relativeError.message);
        // Fallback to absolute URL if relative fails
        res = await api.post("http://localhost:5000/api/user/login", formData);
      }
      
      // Debug the response
      console.log("Full response:", res.data);
      
      const { token, user, message: responseMessage } = res.data;
      
      // Check if token actually exists and is valid
      if (!token || token === 'undefined' || typeof token !== 'string') {
        console.error("Invalid token received:", token);
        setMessage("Login failed: Invalid token received");
        return;
      }
      
      if (!user || (!user._id && !user.id)) {
        console.error("Invalid user received:", user);
        setMessage("Login failed: Invalid user data received");
        return;
      }

      // Store token and user data
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      
      // Verify storage worked
      console.log("Stored token:", localStorage.getItem("token"));
      console.log("Stored user:", localStorage.getItem("user"));
      
      // Set success message
      setMessage(responseMessage || res.data.message || "Login successful!");
      
      // Call onLogin with both user and token for compatibility
      if (onLogin.length === 2) {
        // If onLogin expects 2 parameters (userData, token)
        onLogin(user, token);
      } else {
        // If onLogin expects 1 parameter (userData only)
        onLogin(user);
      }
      
      // Navigate to dashboard with user ID, fallback to plain dashboard
      const userId = user._id || user.id;
      if (userId) {
        navigate(`/dashboard/${userId}`, { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
      
    } catch (error) {
      console.error("Login error:", error);
      
      // Handle different error scenarios
      if (error.response?.data) {
        console.error("Server error response:", error.response.data);
        setMessage(error.response.data.message || "Login failed");
      } else if (error.request) {
        console.error("Network error:", error.request);
        setMessage("Network error: Please check your connection");
      } else {
        console.error("Unknown error:", error.message);
        setMessage("Login failed: " + error.message);
      }
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