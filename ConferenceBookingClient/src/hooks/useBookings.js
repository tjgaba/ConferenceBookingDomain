// useBookings.js — Axios-powered hook (Requirement 3: The Refactor).
//
// Uses the centralized apiClient singleton (src/api/apiClient.js).
// No raw fetch() or direct axios calls — all HTTP traffic flows through apiClient.

import { useState, useEffect } from 'react';
import axios from 'axios';
import apiClient from '../api/apiClient';

/**
 * Fetches all bookings from the backend API.
 *
 * State pattern:
 *   loading  — true while the request is in flight.
 *   error    — null on success; a descriptive string on any failure.
 *   bookings — [] initially; populated only on a successful 200 OK response.
 *
 * AbortController is created inside useEffect so every mount gets a fresh
 * controller. Its signal is passed to the Axios call so the request is
 * cancelled if the component unmounts before the response arrives.
 *
 * @returns {{ bookings: Array, setBookings: Function, loading: boolean, error: string|null }}
 */
function useBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchBookings = async () => {
      setLoading(true);
      setError(null);

      try {
        // The response interceptor already unwraps response.data, so the
        // resolved value here is the server's pagination object:
        //   { data: [...], totalCount: N, page: 1, pageSize: 100 }
        // We destructure to extract the bookings array — no .data chaining.
        const { data: fetchedBookings } = await apiClient.get('/Booking', {
          params: { page: 1, pageSize: 100, sortBy: 'CreatedAt', sortOrder: 'desc' },
          signal: controller.signal,
        });

        setBookings(fetchedBookings ?? []);
      } catch (err) {
        // ── Cancelled (intentional cleanup) ──────────────────────────────
        // Component unmounted before the response arrived. Not an error.
        if (axios.isCancel(err)) return;

        // ── Timeout ───────────────────────────────────────────────────────
        // Server did not respond within the 5 s window defined in apiClient.
        if (err.code === 'ECONNABORTED') {
          setError('The server took too long to respond. Please try again.');
          return;
        }

        // ── Server error (4xx / 5xx) ───────────────────────────────────────
        // The server replied but with an error status code.
        if (err.response) {
          const msg = err.response.data?.message ?? err.message;
          setError(`Server error ${err.response.status}: ${msg}`);
          return;
        }

        // ── Network error ──────────────────────────────────────────────────
        // No response at all — server is unreachable or DNS failed.
        setError('Cannot reach the server. Check your network connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();

    // Cleanup: abort the in-flight request when the component unmounts or
    // the effect re-runs. Prevents state updates on unmounted components.
    return () => controller.abort();
  }, []);

  return { bookings, setBookings, loading, error };
}

export default useBookings;
