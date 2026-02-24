// useBookings.js — Custom hook for fetching and managing bookings state.
//
// Requirement: "The Live Hook" — uses Axios via bookingService to fetch from the
// real backend API. Initial state is [] and populates only after a successful
// 200 OK response.

import { useState, useEffect } from 'react';
import * as bookingService from '../services/bookingService';

/**
 * Custom hook that fetches all bookings from the backend API.
 *
 * @returns {{ bookings: Array, setBookings: Function, isLoading: boolean, error: Error|null, refetch: Function }}
 */
function useBookings() {
  const [bookings, setBookings] = useState([]); // Starts empty — populated only on 200 OK
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBookings = async (signal) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await bookingService.fetchAllBookings();
      if (!signal?.aborted) {
        setBookings(data);
      }
    } catch (err) {
      if (!signal?.aborted) {
        setError(err);
        console.error('useBookings: failed to fetch bookings:', err);
      }
    } finally {
      if (!signal?.aborted) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchBookings(controller.signal);
    return () => controller.abort();
  }, []);

  const refetch = () => fetchBookings();

  return { bookings, setBookings, isLoading, error, refetch };
}

export default useBookings;
