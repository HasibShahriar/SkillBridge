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
  
    const hardcodedToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4YzQzNzNkNDhjZDQ0N2U0OTgyZjUyMCIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc1Nzg4MDkxMiwiZXhwIjoxNzU3ODg0NTEyfQ.0w5Pg3fZnzUowlun5QqFKVR902EDRJu8-odWV57-WfA";
    
    config.headers['Authorization'] = `Bearer ${hardcodedToken}`;
    return config;
}, error => {
    return Promise.reject(error);
});

export default api;