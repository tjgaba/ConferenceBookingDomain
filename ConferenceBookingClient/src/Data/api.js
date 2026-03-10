// api.js - Simulated Async API Service
//
// This module simulates real-world API behavior including:
// - Network latency (random delays)
// - Server failures (random errors)
// - Asynchronous operations
// - Data persistence via localStorage
//
// In production, these functions would call fetch() or axios to a real backend.
// For this assignment, we simulate network behavior to demonstrate proper
// async state management, error handling, and cleanup.

import { loadBookings, saveBookings, loadRooms, saveRooms } from "./localStorage";
import { bookings as initialBookings, rooms as initialRooms } from "./mockData";

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

// ==================== BOOKINGS API ====================

/**
 * Fetch all bookings from "server" (localStorage)
 * @returns {Promise<Array>} Array of booking objects
 * @throws {Error} Network or server errors
 */
export const fetchBookings = async () => {
  return withNetworkSimulation(() => {
    const bookings = loadBookings(initialBookings);
    console.log('✓ API: Fetched bookings', bookings.length);
    return bookings;
  });
};

/**
 * Create a new booking on "server"
 * @param {Object} bookingData - Booking to create
 * @returns {Promise<Object>} Created booking with server-generated ID
 * @throws {Error} Network or server errors
 */
export const createBooking = async (bookingData) => {
  return withNetworkSimulation(() => {
    const bookings = loadBookings(initialBookings);
    const newBooking = {
      ...bookingData,
      id: Date.now(), // Simulate server-generated ID
    };
    const updated = [...bookings, newBooking];
    saveBookings(updated);
    console.log('✓ API: Created booking', newBooking.id);
    return newBooking;
  });
};

/**
 * Update an existing booking on "server"
 * @param {Object} bookingData - Booking with updated fields
 * @returns {Promise<Object>} Updated booking
 * @throws {Error} Network or server errors
 */
export const updateBooking = async (bookingData) => {
  return withNetworkSimulation(() => {
    const bookings = loadBookings(initialBookings);
    const updated = bookings.map(b => 
      b.id === bookingData.id ? bookingData : b
    );
    saveBookings(updated);
    console.log('✓ API: Updated booking', bookingData.id);
    return bookingData;
  });
};

/**
 * Delete a booking from "server"
 * @param {number} bookingId - ID of booking to delete
 * @returns {Promise<void>}
 * @throws {Error} Network or server errors
 */
export const deleteBooking = async (bookingId) => {
  return withNetworkSimulation(() => {
    const bookings = loadBookings(initialBookings);
    const updated = bookings.filter(b => b.id !== bookingId);
    saveBookings(updated);
    console.log('✓ API: Deleted booking', bookingId);
  });
};

// ==================== ROOMS API ====================

/**
 * Fetch all rooms from "server" (localStorage)
 * @returns {Promise<Array>} Array of room objects
 * @throws {Error} Network or server errors
 */
export const fetchRooms = async () => {
  return withNetworkSimulation(() => {
    const rooms = loadRooms(initialRooms);
    console.log('✓ API: Fetched rooms', rooms.length);
    return rooms;
  });
};

/**
 * Create a new room on "server"
 * @param {Object} roomData - Room to create
 * @returns {Promise<Object>} Created room with server-generated ID
 * @throws {Error} Network or server errors
 */
export const createRoom = async (roomData) => {
  return withNetworkSimulation(() => {
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
 * @throws {Error} Network or server errors
 */
export const updateRoom = async (roomData) => {
  return withNetworkSimulation(() => {
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
 * @throws {Error} Network or server errors
 */
export const deleteRoom = async (roomId) => {
  return withNetworkSimulation(() => {
    const rooms = loadRooms(initialRooms);
    const updated = rooms.filter(r => r.id !== roomId);
    saveRooms(updated);
    console.log('✓ API: Deleted room', roomId);
  });
};
