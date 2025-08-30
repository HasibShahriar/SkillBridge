import React, { useState } from "react";
import axios from "axios";
import "./register.css";

const AddUser = ({ onUserAdded }) => {
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/user/register", 
        { firstname, lastname, email, password }, 
        { headers: { "Content-Type": "application/json" } } 
      );
      onUserAdded(res.data); 
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
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

export default AddUser;