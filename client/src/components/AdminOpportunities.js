// client/src/pages/AdminOpportunities.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminOpportunities.css";
import { useNavigate } from "react-router-dom";

function AdminOpportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [form, setForm] = useState({
    title: "",
    type: "Job",
    description: "",
    link: "",
    deadline: "",
  });
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
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
      const res = await axios.get("http://localhost:5000/api/opportunities");
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
    if (!token || user.role !== "admin") {
      alert("Please log in as an admin to add an opportunity.");
      navigate("/login");
      return;
    }
    try {
      await axios.post("http://localhost:5000/api/opportunities", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForm({ title: "", type: "Job", description: "", link: "", deadline: "" });
      fetchOpportunities();
      alert("Opportunity added!");
    } catch (err) {
      console.error("Submit error:", err.response?.data || err.message);
      alert("Failed to add opportunity: " + (err.response?.data?.message || "Unknown error"));
    }
  };

  const handleDelete = async (id) => {
    if (!token || user.role !== "admin") {
      alert("Please log in as an admin to delete an opportunity.");
      navigate("/login");
      return;
    }
    if (!window.confirm("Are you sure?")) return;
    try {
      const response = await axios.delete(`http://localhost:5000/api/opportunities/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
            {token && user.role === "admin" && (
              <button className="delete-btn" onClick={() => handleDelete(op._id)}>Delete</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminOpportunities;