// authService.js - Authentication API calls
import apiClient from './api.js';

export const authService = {
  /**
   * Login user and receive JWT token
   * @param {string} username 
   * @param {string} password 
   * @returns {Promise<{token: string, refreshToken: string, user: object}>}
   */
  async login(username, password) {
    const response = await apiClient.post('/auth/login', {
      username,
      password
    });
    
    // Store token in localStorage for future requests
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      if (response.data.refreshToken) {
        localStorage.setItem('refreshToken', response.data.refreshToken);
      }
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
    }
    
    return response.data;
  },

  /**
   * Logout and revoke session
   */
  async logout() {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage regardless of API call success
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },

  /**
   * Get current user from localStorage
   */
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  /**
   * Check if user is logged in
   */
  isAuthenticated() {
    return !!localStorage.getItem('token');
  }
};
