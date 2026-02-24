// roomService.js - Real Room API Service
//
// This module handles all room-related API calls to the .NET backend.
// Replaces the previous mock/localStorage implementation with real HTTP requests.
//
// All functions use the centralized apiClient (axios) which handles:
// - Base URL configuration
// - JWT authentication
// - Error handling
// - Request/response logging

import apiClient from './api';

// ==================== ROOM API FUNCTIONS ====================

/**
 * Fetch all rooms from the server with optional filtering and pagination
 * @param {Object} params - Query parameters { location, isActive, page, pageSize }
 * @returns {Promise<Array>} Array of room objects
 * @throws {Error} Network or server errors
 */
export const fetchAllRooms = async (params = {}) => {
  try {
    // Default parameters for fetching all active rooms
    const queryParams = {
      page: params.page || 1,
      pageSize: params.pageSize || 100,
      isActive: params.isActive !== undefined ? params.isActive : true,
      ...params
    };
    
    const response = await apiClient.get('/Room', { params: queryParams });
    console.log('✓ API: Fetched rooms', response.data.data?.length || 0);
    // Return just the data array for backward compatibility
    return response.data.data || [];
  } catch (error) {
    console.error('❌ Failed to fetch rooms:', error);
    throw error;
  }
};

/**
 * Get a single room by ID
 * @param {number} roomId - Room ID
 * @returns {Promise<Object>} Room details
 * @throws {Error} Network or server errors
 */
export const getRoomById = async (roomId) => {
  try {
    const response = await apiClient.get(`/Room/${roomId}`);
    console.log('✓ API: Fetched room', roomId);
    return response.data;
  } catch (error) {
    console.error(`❌ Failed to fetch room ${roomId}:`, error);
    throw error;
  }
};

/**
 * Create a new room on the server
 * @param {Object} roomData - Room to create
 * @returns {Promise<Object>} Created room with server-generated ID
 * @throws {Error} Network or server errors
 */
export const createRoom = async (roomData) => {
  try {
    const response = await apiClient.post('/RoomManagement', roomData);
    console.log('✓ API: Created room', response.data.id);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to create room:', error);
    throw error;
  }
};

/**
 * Update an existing room on the server
 * @param {number} roomId - ID of room to update
 * @param {Object} roomData - Updated room fields
 * @returns {Promise<Object>} Updated room
 * @throws {Error} Network or server errors
 */
export const updateRoom = async (roomId, roomData) => {
  try {
    const response = await apiClient.put(`/RoomManagement/${roomId}`, roomData);
    console.log('✓ API: Updated room', roomId);
    return response.data;
  } catch (error) {
    console.error(`❌ Failed to update room ${roomId}:`, error);
    throw error;
  }
};

/**
 * Delete a room from the server (soft delete)
 * @param {number} roomId - ID of room to delete
 * @returns {Promise<void>}
 * @throws {Error} Network or server errors
 */
export const deleteRoom = async (roomId) => {
  try {
    await apiClient.delete(`/RoomManagement/${roomId}`);
    console.log('✓ API: Deleted room', roomId);
  } catch (error) {
    console.error(`❌ Failed to delete room ${roomId}:`, error);
    throw error;
  }
};

/**
 * Update room status (active/inactive)
 * @param {number} roomId - Room ID
 * @param {boolean} isActive - New status
 * @returns {Promise<Object>} Updated room
 * @throws {Error} Network or server errors
 */
export const updateRoomStatus = async (roomId, isActive) => {
  try {
    const response = await apiClient.patch(`/RoomManagement/status/${roomId}`, { isActive });
    console.log('✓ API: Updated room status', roomId, isActive);
    return response.data;
  } catch (error) {
    console.error(`❌ Failed to update room status ${roomId}:`, error);
    throw error;
  }
};

/**
 * Check available rooms for a specific date/time range
 * @param {Object} params - { startDate, endDate, capacity }
 * @returns {Promise<Array>} Available rooms
 * @throws {Error} Network or server errors
 */
export const checkAvailableRooms = async (params) => {
  try {
    const response = await apiClient.post('/Room/check-available', params);
    console.log('✓ API: Checked available rooms');
    return response.data;
  } catch (error) {
    console.error('❌ Failed to check available rooms:', error);
    throw error;
  }
};

