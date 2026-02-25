// authService.js - Authentication API calls
import apiClient from '../api/apiClient';

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
    
    // Interceptor already unwraps response.data → response IS the payload
    if (response.token) {
      localStorage.setItem('token', response.token);
      if (response.refreshToken) {
        localStorage.setItem('refreshToken', response.refreshToken);
      }
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
      }
    }
    
    return response;
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
