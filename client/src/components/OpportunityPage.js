// client/src/pages/OpportunityPage.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./OpportunityPage.css";

function OpportunityPage() {
  const [opportunities, setOpportunities] = useState([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState([]);
  const [typeFilter, setTypeFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(5); // Number of items per page

  // Fetch opportunities from backend
  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/opportunities");
        setOpportunities(res.data || []); // Safe fallback
      } catch (err) {
        console.error("Error fetching opportunities:", err);
      }
    };
    fetchOpportunities();
  }, []);

  // Filter opportunities when typeFilter or opportunities change
  useEffect(() => {
    let filtered = opportunities;
    if (typeFilter !== "All") {
      filtered = opportunities.filter((op) => op.type === typeFilter);
    }
    setFilteredOpportunities(filtered);
    setCurrentPage(1); // Reset to first page on filter change
  }, [typeFilter, opportunities]);

  // Pagination calculation
  const indexOfLast = currentPage * perPage;
  const indexOfFirst = indexOfLast - perPage;
  const currentOps = filteredOpportunities.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil((filteredOpportunities || []).length / perPage);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="opportunity-container">
      <h1>Opportunities</h1>

      {/* Filter dropdown */}
      <div className="filter-container">
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="All">All Types</option>
          <option value="Job">Job</option>
          <option value="Scholarship">Scholarship</option>
          <option value="Internship">Internship</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Opportunity cards */}
      <div className="opportunity-list">
        {currentOps.length === 0 ? (
          <p>No opportunities available.</p>
        ) : (
          currentOps.map((op) => (
            <div key={op._id} className="opportunity-card">
              <h3>{op.title}</h3>
              <p><strong>Type:</strong> {op.type}</p>
              <p>{op.description}</p>
              {op.link && (
                <p>
                  <a href={op.link} target="_blank" rel="noopener noreferrer">
                    More Info
                  </a>
                </p>
              )}
              {op.deadline && (
                <p>
                  <strong>Deadline:</strong>{" "}
                  {new Date(op.deadline).toLocaleDateString()}
                </p>
              )}
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination-container">
          <button
            className="pagination-btn"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={`pagination-btn ${
                currentPage === i + 1 ? "active" : ""
              }`}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="pagination-btn"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default OpportunityPage;
