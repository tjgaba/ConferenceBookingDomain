// localStorage.js - Utility for persisting data in browser storage
//
// localStorage is a browser API that stores data as JSON strings
// Data persists even after browser refresh or restart
// Storage limit: ~5-10MB depending on browser

const STORAGE_KEYS = {
  BOOKINGS: 'conference-bookings',
  ROOMS: 'conference-rooms'
};

/**
 * Load bookings from localStorage
 * @param {Array} fallbackData - Default data if nothing is stored
 * @returns {Array} - Parsed bookings array
 */
export const loadBookings = (fallbackData = []) => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    return stored ? JSON.parse(stored) : fallbackData;
  } catch (error) {
    console.error('Error loading bookings from localStorage:', error);
    return fallbackData;
  }
};

/**
 * Save bookings to localStorage
 * @param {Array} bookings - Bookings array to persist
 */
export const saveBookings = (bookings) => {
  try {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  } catch (error) {
    console.error('Error saving bookings to localStorage:', error);
  }
};

/**
 * Load rooms from localStorage
 * @param {Array} fallbackData - Default data if nothing is stored
 * @returns {Array} - Parsed rooms array
 */
export const loadRooms = (fallbackData = []) => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.ROOMS);
    return stored ? JSON.parse(stored) : fallbackData;
  } catch (error) {
    console.error('Error loading rooms from localStorage:', error);
    return fallbackData;
  }
};

/**
 * Save rooms to localStorage
 * @param {Array} rooms - Rooms array to persist
 */
export const saveRooms = (rooms) => {
  try {
    localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(rooms));
  } catch (error) {
    console.error('Error saving rooms to localStorage:', error);
  }
};

/**
 * Clear all persisted data (useful for reset/logout)
 */
export const clearStorage = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.BOOKINGS);
    localStorage.removeItem(STORAGE_KEYS.ROOMS);
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};
