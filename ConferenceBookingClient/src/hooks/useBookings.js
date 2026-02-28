// useBookings.js — Custom Hook: fetch, create, and update bookings (Command Handshake).
//
// Req 1: Exposes createBooking() and updateBooking() using Axios POST / PUT.
// Req 2: Payload shapes match the .NET [FromBody] DTOs exactly:
//
//   CreateBookingRequestDTO  →  { roomId, startDate, endDate, location, capacity }
//   UpdateBookingDTO         →  { bookingId, roomId?, startTime?, endTime?, status? }
//
// Req 3: After every successful mutation, refetch() is called internally so the
//        bookings list always reflects the latest server state (Pessimistic Update).
//
// Uses the centralized apiClient singleton (src/api/apiClient.js).
// No raw fetch() or direct axios calls — all HTTP traffic flows through apiClient.

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import apiClient from '../api/apiClient';

/**
 * Manages all booking CRUD operations and exposes reactive state.
 *
 * State:
 *   bookings   — current list, refreshed after every mutation.
 *   loading    — true while any request is in flight.
 *   mutating   — true specifically during POST / PUT so the UI can disable submit.
 *   error      — null on success; descriptive string on failure.
 *
 * @returns {{
 *   bookings: Array,
 *   setBookings: Function,
 *   loading: boolean,
 *   mutating: boolean,
 *   error: string|null,
 *   refetch: Function,
 *   createBooking: Function,
 *   updateBooking: Function,
 * }}
 */
function useBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [mutating, setMutating] = useState(false);
  const [error, setError]       = useState(null);

  // ── Internal helpers ─────────────────────────────────────────────────────────

  /** Classify Axios errors into a human-readable string. */
  const classifyError = (err) => {
    if (err.code === 'ECONNABORTED') return 'The server took too long to respond. Please try again.';
    if (err.response) {
      const msg = err.response.data?.message ?? err.response.data?.title ?? err.message;
      return `Server error ${err.response.status}: ${msg}`;
    }
    return 'Cannot reach the server. Check your network connection.';
  };

  // ── Req 3: refetch ───────────────────────────────────────────────────────────
  // Exposed so consumers can trigger a refresh imperatively if needed.
  // Also called internally after every successful mutation.
  const refetch = useCallback(async (signal) => {
    setLoading(true);
    setError(null);
    try {
      const { data: fetchedBookings } = await apiClient.get('/Booking', {
        params: { page: 1, pageSize: 100, sortBy: 'CreatedAt', sortOrder: 'desc' },
        signal,
      });
      setBookings(fetchedBookings ?? []);
    } catch (err) {
      if (axios.isCancel(err)) return; // Intentional abort — not an error.
      setError(classifyError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on mount; abort on unmount to prevent state updates after removal.
  useEffect(() => {
    const controller = new AbortController();
    refetch(controller.signal);
    return () => controller.abort();
  }, [refetch]);

  // ── Extra Credit: SignalR real-time sync ─────────────────────────────────────
  // When any client creates or updates a booking, the backend broadcasts the
  // event to all connected clients. We re-fetch here so every open tab stays
  // in sync without the user needing to refresh.
  // The connection lifecycle (start / stop / cleanup) is fully managed by useSignalR.
  useSignalR({
    onBookingChange: useCallback(() => {
      refetch();
    }, [refetch]),
  });

  // ── Req 1 + 2: createBooking (POST) ─────────────────────────────────────────
  /**
   * Create a new booking.
   *
   * Payload must match CreateBookingRequestDTO:
   *   { roomId: number, startDate: string (ISO), endDate: string (ISO),
   *     location: string, capacity: number }
   *
   * Req 3: Re-fetches the full list after a successful 200/201 response.
   *
   * @param {{ roomId: number, startDate: string, endDate: string, location: string, capacity: number }} bookingData
   * @returns {Promise<Object>} The created booking returned by the server.
   * @throws Re-throws on validation (400) or auth (401/403) errors so the
   *         calling component can map ProblemDetails to form fields.
   */
  const createBooking = useCallback(async (bookingData) => {
    // Req 2: Enforce payload contract — only the fields CreateBookingRequestDTO expects.
    const payload = {
      roomId:    bookingData.roomId,
      startDate: bookingData.startDate,
      endDate:   bookingData.endDate,
      location:  bookingData.location,
      capacity:  bookingData.capacity,
    };

    setMutating(true);
    setError(null);
    try {
      const created = await apiClient.post('/Booking', payload);
      await refetch(); // Req 3: Pessimistic Update — sync with server.
      return created;
    } catch (err) {
      setError(classifyError(err));
      throw err; // Re-throw so the form can handle field-level errors.
    } finally {
      setMutating(false);
    }
  }, [refetch]);

  // ── Req 1 + 2: updateBooking (PUT) ──────────────────────────────────────────
  /**
   * Update an existing booking.
   *
   * Payload must match UpdateBookingDTO:
   *   { bookingId: number, roomId?: number, startTime?: string (ISO),
   *     endTime?: string (ISO), status?: string }
   *
   * Req 3: Re-fetches the full list after a successful response.
   *
   * @param {number} bookingId
   * @param {{ roomId?: number, startTime?: string, endTime?: string, status?: string }} bookingData
   * @returns {Promise<Object>} The updated booking returned by the server.
   * @throws Re-throws on validation (400) or auth errors.
   */
  const updateBooking = useCallback(async (bookingId, bookingData) => {
    // Req 2: Enforce payload contract — only the fields UpdateBookingDTO expects.
    const payload = {
      bookingId,
      ...(bookingData.roomId    !== undefined && { roomId:    bookingData.roomId }),
      ...(bookingData.startTime !== undefined && { startTime: bookingData.startTime }),
      ...(bookingData.endTime   !== undefined && { endTime:   bookingData.endTime }),
      ...(bookingData.status    !== undefined && { status:    bookingData.status }),
    };

    setMutating(true);
    setError(null);
    try {
      const updated = await apiClient.put(`/Booking/${bookingId}`, payload);
      await refetch(); // Req 3: Pessimistic Update — sync with server.
      return updated;
    } catch (err) {
      setError(classifyError(err));
      throw err; // Re-throw so the form can handle field-level errors.
    } finally {
      setMutating(false);
    }
  }, [refetch]);

  return { bookings, setBookings, loading, mutating, error, refetch, createBooking, updateBooking };
}

export default useBookings;
