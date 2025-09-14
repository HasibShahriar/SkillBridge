// client/src/pages/AdminOpportunities.js
import React, { useState, useEffect } from "react";
import "./AdminOpportunities.css";
import { useNavigate } from "react-router-dom";
import api from '../api'; // Use your configured api instance

function AdminOpportunities() {
  // Add this at the very beginning
  console.log("COMPONENT MOUNT - localStorage contents:");
  console.log("All localStorage keys:", Object.keys(localStorage));
  console.log("Token from localStorage:", localStorage.getItem("token"));
  console.log("User from localStorage:", localStorage.getItem("user"));
  const [opportunities, setOpportunities] = useState([]);
  const [form, setForm] = useState({
    title: "",
    type: "Job",
    description: "",
    link: "",
    deadline: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Read token and user fresh from localStorage inside useEffect
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    
    // Log token and user for debugging
    console.log("Token:", token, "User:", user);
    
    // Redirect if not logged in or not an admin
    if (!token || user.role !== "admin") {
      alert("You must be an admin to access this page.");
      navigate("/login");
      return;
    }
    fetchOpportunities();
  }, [navigate]);

  const fetchOpportunities = async () => {
    try {
      // Use api instance instead of direct axios
      const res = await api.get("/api/opportunities");
      setOpportunities(res.data);
    } catch (err) {
      console.error("Fetch error:", err.response?.data || err.message);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Read fresh token and user from localStorage
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    
    if (!token || user.role !== "admin") {
      alert("Please log in as an admin to add an opportunity.");
      navigate("/login");
      return;
    }
    try {
      // Use api instance - it will automatically include the token
      await api.post("/api/opportunities", form);
      setForm({ title: "", type: "Job", description: "", link: "", deadline: "" });
      fetchOpportunities();
      alert("Opportunity added!");
    } catch (err) {
      console.error("Submit error:", err.response?.data || err.message);
      alert("Failed to add opportunity: " + (err.response?.data?.message || "Unknown error"));
    }
  };

  const handleDelete = async (id) => {
    // Read fresh token and user from localStorage
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    
    if (!token || user.role !== "admin") {
      alert("Please log in as an admin to delete an opportunity.");
      navigate("/login");
      return;
    }
    if (!window.confirm("Are you sure?")) return;
    try {
      // Use api instance - it will automatically include the token
      const response = await api.delete(`/api/opportunities/${id}`);
      fetchOpportunities();
      alert("Opportunity deleted: " + (response.data.message || "Success"));
    } catch (err) {
      console.error("Delete error:", err.response?.data || err.message);
      if (err.response?.status === 401) {
        alert("Unauthorized: Your session may have expired. Please log in again.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      } else if (err.response?.status === 403) {
        alert("Forbidden: Only admins can delete opportunities. Please verify your account.");
        navigate("/login");
      } else {
        alert("Failed to delete opportunity: " + (err.response?.data?.message || "Unknown error"));
      }
    }
  };

  return (
    <div className="admin-opportunity-container">
      <h1>Admin - Manage Opportunities</h1>
      <form className="opportunity-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <select name="type" value={form.type} onChange={handleChange}>
          <option value="Job">Job</option>
          <option value="Scholarship">Scholarship</option>
          <option value="Internship">Internship</option>
          <option value="Other">Other</option>
        </select>
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
        />
        <input
          type="url"
          name="link"
          placeholder="External Link (optional)"
          value={form.link}
          onChange={handleChange}
        />
        <input
          type="date"
          name="deadline"
          value={form.deadline}
          onChange={handleChange}
        />
        <button type="submit">Add Opportunity</button>
      </form>

      <div className="opportunity-list">
        {opportunities.map((op) => (
          <div key={op._id} className="opportunity-card">
            <h3>{op.title}</h3>
            <p><strong>Type:</strong> {op.type}</p>
            <p>{op.description}</p>
            {op.link && <a href={op.link} target="_blank" rel="noopener noreferrer">More Info</a>}
            {op.deadline && <p><strong>Deadline:</strong> {new Date(op.deadline).toLocaleDateString()}</p>}
            {(() => {
              const token = localStorage.getItem("token");
              const user = JSON.parse(localStorage.getItem("user") || "{}");
              return token && user.role === "admin";
            })() && (
              <button className="delete-btn" onClick={() => handleDelete(op._id)}>Delete</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminOpportunities;