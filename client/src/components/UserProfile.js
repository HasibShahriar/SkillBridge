// UserProfile.js 
import React, { useEffect, useState } from "react";
import { Camera } from "lucide-react"
import api from "../api";
import "./UserProfile.css";

const emptySocial = { facebook: "", instagram: "", twitter: "" };

export default function UserProfile() {
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSocialEditing, setIsSocialEditing] = useState(false);
  const [isBioEditing, setIsBioEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    phone: "",
    address: "",
    socialLinks: emptySocial,
    courses: [],
  });

  const fullName = formData.name;

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        // Fix: Get token from localStorage directly, not from user object
        const token = localStorage.getItem("token");
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        
        if (!token) {
          setError("Not logged in - no token found");
          setLoading(false);
          return;
        }

        // Fix: Use the correct API call (token is already attached via interceptor)
        const res = await api.get("/api/user/profile");

        const user = res.data;
        setFormData({
          name: user.name || user.firstname ? `${user.firstname || ""} ${user.lastname || ""}`.trim() : (user.name || ""),
          email: user.email || "",
          bio: user.bio || "",
          phone: user.phone || "",
          address: user.address || "",
          socialLinks: (typeof user.socialLinks === "object" && user.socialLinks) ? user.socialLinks : emptySocial,
          courses: Array.isArray(user.courses) ? user.courses : [],
        });
        setError(null);
      } catch (err) {
        console.error("fetchProfile err", err);
        if (err.response?.status === 401) {
          setError("Session expired. Please login again.");
          // Clear invalid token
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        } else {
          setError("Failed to load profile");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);
  
  const handleInputChange = (field, value) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setFormData(prev => ({ ...prev, [parent]: { ...(prev[parent] || {}), [child]: value } }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handlePhoneChange = (value) => {
    const numbersOnly = value.replace(/[^0-9]/g, "");
    handleInputChange("phone", numbersOnly);
  };

  const updateProfile = async (payload) => {
    try {
      setIsUpdating(true);
      
      // Fix: Get token from localStorage directly
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      // The token is already attached via the interceptor in api.js, so no need to manually add headers
      const res = await api.put('/api/user/profile', payload);

      const user = res.data;
      setFormData(prev => ({
        ...prev,
        name: user.name || `${user.firstname || ""} ${user.lastname || ""}`.trim(),
        email: user.email || prev.email,
        bio: user.bio || prev.bio,
        phone: user.phone || prev.phone,
        address: user.address || prev.address,
        socialLinks: user.socialLinks || prev.socialLinks,
        courses: user.courses || prev.courses
      }));
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("updateProfile err", err);
      if (err.response?.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      } else if (err.response) {
        // Server responded with error status
        const errorMessage = err.response.data?.message || `Server error: ${err.response.status}`;
        alert(`Failed to update profile: ${errorMessage}`);
      } else if (err.request) {
        // Network error
        alert("Failed to update profile: Network error. Please check your connection.");
      } else {
        // Other error
        alert(`Failed to update profile: ${err.message}`);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleBasicInfoSave = () => {
    updateProfile({ name: formData.name, email: formData.email, phone: formData.phone, address: formData.address });
    setIsEditing(false);
  };

  const handleBioSave = () => {
    updateProfile({ bio: formData.bio });
    setIsBioEditing(false);
  };

  const handleSocialSave = () => {
    updateProfile({ socialLinks: formData.socialLinks });
    setIsSocialEditing(false);
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div>
          <div className="spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-content">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="retry-btn"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-wrapper">
        {/* Profile Image, Name and Bio Section */}
        <div className="profile-card">
          <div className="profile-avatar">
            <Camera size={24} />
          </div>

          <h2 className="profile-name">
            {fullName || "User Name"}
          </h2>

          {/* Bio Section */}
          <div className="profile-bio">
            {isBioEditing ? (
              <div>
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  className="bio-textarea"
                  placeholder="Add your bio..."
                  rows="3"
                  disabled={isUpdating}
                />
                <div className="btn-group">
                  <button
                    onClick={handleBioSave}
                    className="btn btn-primary"
                    disabled={isUpdating}
                  >
                    {isUpdating ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={() => setIsBioEditing(false)}
                    className="btn btn-secondary"
                    disabled={isUpdating}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p className="bio-text">
                  {formData.bio || "No bio added yet"}
                </p>
                <button
                  onClick={() => setIsBioEditing(true)}
                  className="btn btn-primary"
                >
                  Add bio
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Basic Information Section */}
        <div className="section-card">
          <h3 className="section-title">Basic Information</h3>
          <div className="form-group">
            <div className="form-field">
              <input
                type="text"
                value={formData.name || ""}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="form-input"
                disabled={!isEditing || isUpdating}
                placeholder={formData.name || "Enter full name"}
              />
            </div>
            <div className="form-field">
              <input
                type="email"
                value={formData.email || ""}
                className="form-input"
                disabled={true}
              />
            </div>
            <div className="form-field">
              <input
                type="password"
                value="••••••••"
                className="form-input"
                disabled={true}
              />
            </div>
            <div className="form-field">
              <input
                type="tel"
                value={formData.phone || ""}
                onChange={(e) => handlePhoneChange(e.target.value)}
                className="form-input"
                placeholder="Add Phone Number"
                disabled={!isEditing || isUpdating}
              />
            </div>
            <div className="form-field">
              <textarea
                value={formData.address || ""}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className="form-textarea"
                placeholder="Add Address"
                disabled={!isEditing || isUpdating}
                rows="3"
              />
            </div>

            {isEditing ? (
              <div className="form-actions">
                <button
                  onClick={() => setIsEditing(false)}
                  className="btn btn-secondary"
                  disabled={isUpdating}
                >
                  Cancel
                </button>
                <button
                  onClick={handleBasicInfoSave}
                  className="btn btn-primary"
                  disabled={isUpdating}
                >
                  {isUpdating ? "Saving..." : "Save"}
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="btn btn-primary btn-full"
                style={{ marginTop: '0.75rem' }}
              >
                Edit
              </button>
            )}
          </div>
        </div>

        {/* Social Links Section */}
        <div className="section-card">
          <h3 className="section-title">Social Links</h3>

          {isSocialEditing ? (
            <div className="social-edit-form">
              {Object.entries(formData.socialLinks).map(([platform, url]) => (
                <div key={platform} className="social-edit-row">
                  <div className={`social-icon ${platform}`}>
                    {platform === 'facebook' && 'f'}
                    {platform === 'instagram' && '📷'}
                    {platform === 'twitter' && '🦅'}
                  </div>
                  <span className="social-label">{platform}</span>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) =>
                      handleInputChange(`socialLinks.${platform}`, e.target.value)
                    }
                    className="social-input"
                    placeholder={`${platform} URL`}
                    disabled={isUpdating}
                  />
                </div>
              ))}
              <div className="form-actions">
                <button
                  onClick={handleSocialSave}
                  className="btn btn-primary"
                  disabled={isUpdating}
                >
                  {isUpdating ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => setIsSocialEditing(false)}
                  className="btn btn-secondary"
                  disabled={isUpdating}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="social-list">
                {Object.entries(formData.socialLinks).map(([platform, url]) => (
                  <div key={platform} className="social-item">
                    <div className="social-info">
                      <div className={`social-icon ${platform}`}>
                        {platform === 'facebook' && 'f'}
                        {platform === 'instagram' && '📷'}
                        {platform === 'twitter' && '🦅'}
                      </div>
                      <span className="social-name">{platform}</span>
                    </div>
                    {url ? (
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link"
                      >
                        View
                      </a>
                    ) : (
                      <span className="social-link">No link</span>
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={() => setIsSocialEditing(true)}
                className="btn-edit-link"
                style={{ marginTop: '0.75rem' }}
              >
                Edit Links
              </button>
            </div>
          )}
        </div>

        {/* My Courses Section */}
        <div className="section-card">
          <h3 className="section-title">My Courses</h3>
          <div className="courses-empty">
            <div className="courses-icon">
              <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            {Array.isArray(formData.courses) && formData.courses.length > 0 ? (
              <div>
                {formData.courses.map((c, i) => (
                  <p key={i} className="courses-text">{c}</p>
                ))}
              </div>
            ) : (
              <p className="courses-text">No courses yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}