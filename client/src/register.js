import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from './api';
import "./register.css";

const Register = () => {
  const navigate = useNavigate();
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm_password, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if(password.length < 8) {
      alert("Password must be at least 8 characters long");
      setIsSubmitting(false);
      return;
    }
    if(password !== confirm_password) {
      alert("Passwords do not match");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await api.post("http://localhost:5000/api/user/register", {
        firstname,
        lastname,
        email,
        password
      }, { headers: { "Content-Type": "application/json" } });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      alert("Registration successful! Redirecting to dashboard...");
      setTimeout(() => {
        navigate("/dashboard"); // redirect to dashboard after successful registration
      }, 1500);

      // reset form
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <form className="modern-form" onSubmit={handleSubmit}>
        <h2 className="form-title">Create New Account</h2>
        
        <div className="input-group">
          <input
            type="text"
            value={firstname}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="form-input"
          />
          <label className="form-label">First Name</label>
        </div>
        
        <div className="input-group">
          <input
            type="text"
            value={lastname}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="form-input"
          />
          <label className="form-label">Last Name</label>
        </div>
        
        <div className="input-group">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="form-input"
          />
          <label className="form-label">Email Address</label>
        </div>
        
        <div className="input-group">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="form-input"
          />
          <label className="form-label">Password</label>
        </div>

        <div className="input-group">
          <input
            type="password"
            value={confirm_password}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="form-input"
          />
          <label className="form-label">Confirm Password</label>
        </div>

        <button 
          type="submit" 
          className="submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
    </div>
  );
};

export default Register;
