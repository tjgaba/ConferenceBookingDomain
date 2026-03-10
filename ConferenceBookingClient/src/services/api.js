// api.js - Axios HTTP Client Configuration
//
// This module provides a centralized axios instance for all API calls with:
// - Base URL configuration from environment variables
// - JWT token authentication via interceptors
// - Global error handling
// - CORS credentials support
//
// All service modules (bookingService, roomService, authService) should import
// this apiClient instead of using axios directly.

import axios from 'axios';

// Read the base URL from environment variable
// Vite requires the VITE_ prefix for environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5230/api';

console.log('🌐 API Base URL:', API_BASE_URL);

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for CORS with credentials
  timeout: 10000, // 10 second timeout
});

// ==================== REQUEST INTERCEPTOR ====================
// Automatically add JWT token to all requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Added auth token to request');
    }
    console.log(`${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// ==================== RESPONSE INTERCEPTOR ====================
// Handle common errors globally
apiClient.interceptors.response.use(
  (response) => {
    console.log(` ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.status, error.response.data);
      
      if (error.response.status === 401) {
        // Token expired or invalid - redirect to login
        console.warn('Unauthorized - clearing token');
        localStorage.removeItem('token');
        // Note: In a production app, you might want to redirect to login page
        // window.location.href = '/login';
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('Network Error: No response from server');
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
