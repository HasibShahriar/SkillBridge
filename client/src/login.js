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
    
    // Fix the URL - remove the full baseURL since api.js already has it
    const res = await api.post("/api/user/login", formData);
    
    console.log("=== LOGIN RESPONSE DEBUG ===");
    console.log("Status:", res.status);
    console.log("Full response object:", res);
    console.log("Response data:", res.data);
    console.log("Token from response:", res.data.token);
    console.log("User from response:", res.data.user);
    console.log("================================");
    
    const token = res.data.token;
    const user = res.data.user;

    if (token && user) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      
      console.log("=== AFTER STORAGE ===");
      console.log("Stored token:", localStorage.getItem("token"));
      console.log("Stored user:", localStorage.getItem("user"));
      console.log("=====================");
      
      setMessage(res.data.message || "Login successful!");
      onLogin(user);
      navigate(`/dashboard/${user._id}`, { replace: true });
    } else {
      console.error("Missing token or user in response");
      setMessage("Login failed: token or user missing in response.");
    }
  } catch (error) {
    console.error("=== LOGIN ERROR ===");
    console.error("Error object:", error);
    console.error("Response data:", error.response?.data);
    console.error("Status:", error.response?.status);
    console.error("===================");
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