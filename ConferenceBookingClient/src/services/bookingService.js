// bookingService.js - Real Booking API Service
//
// This module handles all booking-related API calls to the .NET backend.
// Replaces the previous mock/localStorage implementation with real HTTP requests.
//
// All functions use the centralized apiClient (axios) which handles:
// - Base URL configuration
// - JWT authentication
// - Error handling
// - Request/response logging

import apiClient from './api';

// ==================== BOOKING API FUNCTIONS ====================

/**
 * Fetch all bookings from the server with pagination
 * @param {number} page - Page number (default: 1)
 * @param {number} pageSize - Items per page (default: 10)
 * @param {string} sortBy - Field to sort by
 * @param {string} sortOrder - Sort order (asc/desc)
 * @returns {Promise<Object>} Paginated response with bookings
 * @throws {Error} Network or server errors
 */
export const fetchAllBookings = async (page = 1, pageSize = 100, sortBy = 'CreatedAt', sortOrder = 'desc') => {
  try {
    const response = await apiClient.get('/Booking', {
      params: { page, pageSize, sortBy, sortOrder }
    });
    console.log('✓ API: Fetched bookings', response.data.data?.length || 0);
    // Return just the data array for backward compatibility
    return response.data.data || [];
  } catch (error) {
    console.error('❌ Failed to fetch bookings:', error);
    throw error;
  }
};

/**
 * Get a single booking by ID
 * @param {number} bookingId - Booking ID
 * @returns {Promise<Object>} Booking details
 * @throws {Error} Network or server errors
 */
export const getBookingById = async (bookingId) => {
  try {
    const response = await apiClient.get(`/Booking/${bookingId}`);
    console.log('✓ API: Fetched booking', bookingId);
    return response.data;
  } catch (error) {
    console.error(`❌ Failed to fetch booking ${bookingId}:`, error);
    throw error;
  }
};

/**
 * Create a new booking on the server
 * @param {Object} bookingData - Booking to create
 * @returns {Promise<Object>} Created booking with server-generated ID
 * @throws {Error} Network or server errors
 */
export const createBooking = async (bookingData) => {
  try {
    const response = await apiClient.post('/Booking', bookingData);
    console.log('✓ API: Created booking', response.data.id);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to create booking:', error);
    throw error;
  }
};

/**
 * Update an existing booking on the server
 * @param {number} bookingId - ID of booking to update
 * @param {Object} bookingData - Updated booking fields
 * @returns {Promise<Object>} Updated booking
 * @throws {Error} Network or server errors
 */
export const updateBooking = async (bookingId, bookingData) => {
  try {
    const response = await apiClient.put(`/Booking/${bookingId}`, bookingData);
    console.log('✓ API: Updated booking', bookingId);
    return response.data;
  } catch (error) {
    console.error(`❌ Failed to update booking ${bookingId}:`, error);
    throw error;
  }
};

/**
 * Delete a booking from the server
 * @param {number} bookingId - ID of booking to delete
 * @returns {Promise<void>}
 * @throws {Error} Network or server errors
 */
export const deleteBooking = async (bookingId) => {
  try {
    await apiClient.delete(`/Booking/${bookingId}`);
    console.log('✓ API: Deleted booking', bookingId);
  } catch (error) {
    console.error(`❌ Failed to delete booking ${bookingId}:`, error);
    throw error;
  }
};

/**
 * Check room availability for a date range
 * @param {Object} params - { roomId, startDate, endDate }
 * @returns {Promise<Object>} Availability status
 * @throws {Error} Network or server errors
 */
export const checkAvailability = async (params) => {
  try {
    const response = await apiClient.post('/Booking/check-availability', params);
    console.log('✓ API: Checked availability');
    return response.data;
  } catch (error) {
    console.error('❌ Failed to check availability:', error);
    throw error;
  }
};

/**
 * Filter bookings by criteria
 * @param {Object} filters - Filter criteria
 * @returns {Promise<Array>} Filtered bookings
 * @throws {Error} Network or server errors
 */
export const filterBookings = async (filters) => {
  try {
    const response = await apiClient.post('/Booking/filter', filters);
    console.log('✓ API: Filtered bookings', response.data.length);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to filter bookings:', error);
    throw error;
  }
};

