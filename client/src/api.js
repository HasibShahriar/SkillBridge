import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000
});

// Attach token to requests
api.interceptors.request.use(config => {
    // Get token from localStorage instead of hardcoded
    const token = localStorage.getItem('token');
    
    // Fallback to hardcoded token if no token in localStorage (for development)
    const hardcodedToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4YzQzNzNkNDhjZDQ0N2U0OTgyZjUyMCIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc1Nzg4MDkxMiwiZXhwIjoxNzU3ODg0NTEyfQ.0w5Pg3fZnzUowlun5QqFKVR902EDRJu8-odWV57-WfA";
    
    const authToken = token || hardcodedToken;
    if (authToken) {
        config.headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    return config;
}, error => {
    return Promise.reject(error);
});

// Response interceptor to handle auth errors
api.interceptors.response.use(
    response => {
        return response;
    }, 
    error => {
        const status = error.response?.status;
        if (status === 401 || status === 403) {
            // Clear auth data and redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;