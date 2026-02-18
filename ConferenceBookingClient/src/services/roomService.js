// roomService.js - Simulated Room API Service
//
// This module simulates real-world API behavior for room management
// with the same network characteristics as bookingService.js

import { loadRooms, saveRooms } from "../Data/localStorage";
import { rooms as initialRooms } from "../Data/mockData";

// Configuration for network simulation
const CONFIG = {
  MIN_LATENCY: 500,      // Minimum delay in ms
  MAX_LATENCY: 2500,     // Maximum delay in ms
  FAILURE_RATE: 0.20,    // 20% chance of failure
};

/**
 * Simulates network latency with random delay
 * @returns {Promise} Resolves after random delay
 */
const simulateLatency = () => {
  const delay = Math.random() * (CONFIG.MAX_LATENCY - CONFIG.MIN_LATENCY) + CONFIG.MIN_LATENCY;
  return new Promise(resolve => setTimeout(resolve, delay));
};

/**
 * Simulates random server failures
 * @throws {Error} Random server error
 */
const simulateFailure = () => {
  if (Math.random() < CONFIG.FAILURE_RATE) {
    const errors = [
      'Network request failed',
      'Server timeout (504)',
      'Internal server error (500)',
      'Database connection failed',
      'Service unavailable (503)',
    ];
    throw new Error(errors[Math.floor(Math.random() * errors.length)]);
  }
};

/**
 * Wraps an async operation with latency and failure simulation
 * @param {Function} operation - The operation to execute
 * @returns {Promise} Result of the operation
 */
const withNetworkSimulation = async (operation) => {
  await simulateLatency();
  simulateFailure();
  return operation();
};

// ==================== ROOM API FUNCTIONS ====================

/**
 * Fetch all rooms from "server" (localStorage)
 * @returns {Promise<Array>} Array of room objects
 * @throws {Error} Network or server errors (20% chance)
 */
export const fetchAllRooms = async () => {
  return await withNetworkSimulation(() => {
    const rooms = loadRooms(initialRooms);
    console.log('✓ API: Fetched rooms', rooms.length);
    return rooms;
  });
};

/**
 * Create a new room on "server"
 * @param {Object} roomData - Room to create
 * @returns {Promise<Object>} Created room with server-generated ID
 * @throws {Error} Network or server errors (20% chance)
 */
export const createRoom = async (roomData) => {
  return await withNetworkSimulation(() => {
    const rooms = loadRooms(initialRooms);
    const newRoom = {
      ...roomData,
      id: Date.now(), // Simulate server-generated ID
    };
    const updated = [...rooms, newRoom];
    saveRooms(updated);
    console.log('✓ API: Created room', newRoom.id);
    return newRoom;
  });
};

/**
 * Update an existing room on "server"
 * @param {Object} roomData - Room with updated fields
 * @returns {Promise<Object>} Updated room
 * @throws {Error} Network or server errors (20% chance)
 */
export const updateRoom = async (roomData) => {
  return await withNetworkSimulation(() => {
    const rooms = loadRooms(initialRooms);
    const updated = rooms.map(r => 
      r.id === roomData.id ? roomData : r
    );
    saveRooms(updated);
    console.log('✓ API: Updated room', roomData.id);
    return roomData;
  });
};

/**
 * Delete a room from "server"
 * @param {number} roomId - ID of room to delete
 * @returns {Promise<void>}
 * @throws {Error} Network or server errors (20% chance)
 */
export const deleteRoom = async (roomId) => {
  return await withNetworkSimulation(() => {
    const rooms = loadRooms(initialRooms);
    const updated = rooms.filter(r => r.id !== roomId);
    saveRooms(updated);
    console.log('✓ API: Deleted room', roomId);
  });
};
