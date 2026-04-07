// src/services/api.js - Axios configuration & API calls
import axios from 'axios';

// Base URL - uses Vite proxy in dev, or set full URL in production
const API_BASE = '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request automatically
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('lms_user') || 'null');
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 globally (auto logout)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('lms_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── Auth API ─────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// ─── Leave API ────────────────────────────────────────────────────
export const leaveAPI = {
  apply: (data) => api.post('/leaves/apply', data),
  getMyLeaves: () => api.get('/leaves/my'),
  getPendingLeaves: () => api.get('/leaves/pending'),
  getApprovedLeaves: () => api.get('/leaves/approved'),
  updateLeave: (id, data) => api.put(`/leaves/update/${id}`, data),
};

export default api;
