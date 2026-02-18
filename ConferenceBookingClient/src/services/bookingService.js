// bookingService.js - Simulated Booking API Service
//
// This module simulates real-world API behavior including:
// - Network latency (random delays between 500ms-2500ms)
// - Server failures (20% random rejection rate)
// - Asynchronous operations with Promises
// - Data persistence via localStorage
//
// "Flaky API" Challenge: The promise fails 20% of the time to force
// proper error handling in the UI layer.

import { loadBookings, saveBookings } from "../Data/localStorage";
import { bookings as initialBookings } from "../Data/mockData";

// Configuration for network simulation
const CONFIG = {
  MIN_LATENCY: 500,      // Minimum delay in ms
  MAX_LATENCY: 2500,     // Maximum delay in ms
  FAILURE_RATE: 0.20,    // 20% chance of failure
};

/**
 * Simulates network latency with random delay between 500-2500ms
 * @returns {Promise} Resolves after random delay
 */
const simulateLatency = () => {
  const delay = Math.random() * (CONFIG.MAX_LATENCY - CONFIG.MIN_LATENCY) + CONFIG.MIN_LATENCY;
  return new Promise(resolve => setTimeout(resolve, delay));
};

/**
 * Simulates random server failures (20% of the time)
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

// ==================== BOOKING API FUNCTIONS ====================

/**
 * Fetch all bookings from "server" (localStorage)
 * Returns a Promise that resolves after random delay (500-2500ms)
 * Fails 20% of the time to simulate flaky network conditions
 * 
 * @returns {Promise<Array>} Array of booking objects
 * @throws {Error} Network or server errors (20% chance)
 */
export const fetchAllBookings = async () => {
  return await withNetworkSimulation(() => {
    const bookings = loadBookings(initialBookings);
    console.log('✓ API: Fetched bookings', bookings.length);
    return bookings;
  });
};

/**
 * Create a new booking on "server"
 * @param {Object} bookingData - Booking to create
 * @returns {Promise<Object>} Created booking with server-generated ID
 * @throws {Error} Network or server errors (20% chance)
 */
export const createBooking = async (bookingData) => {
  return await withNetworkSimulation(() => {
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
 * @throws {Error} Network or server errors (20% chance)
 */
export const updateBooking = async (bookingData) => {
  return await withNetworkSimulation(() => {
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
 * @throws {Error} Network or server errors (20% chance)
 */
export const deleteBooking = async (bookingId) => {
  return await withNetworkSimulation(() => {
    const bookings = loadBookings(initialBookings);
    const updated = bookings.filter(b => b.id !== bookingId);
    saveBookings(updated);
    console.log('✓ API: Deleted booking', bookingId);
  });
};
