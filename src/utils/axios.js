// src/utils/axios.js
import axios from 'axios';

// 🔥 AUTO-DETECT ENVIRONMENT
// If running on localhost → use local backend
// If running on live site → use Render backend
const isLocalhost = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1' ||
                    window.location.hostname.includes('192.168');

const baseURL = isLocalhost 
  ? (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api')
  : 'https://laxmipowertech-backend.onrender.com/api';

console.log('🌐 Environment:', isLocalhost ? 'LOCAL' : 'PRODUCTION');
console.log('🌐 Axios configured with baseURL:', baseURL);

const instance = axios.create({
  baseURL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('⚠️ Unauthorized - clearing localStorage');
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default instance;
