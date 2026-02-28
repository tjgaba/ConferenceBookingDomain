// useSignalR.js — Custom Hook: manages the SignalR hub connection lifecycle.
//
// Extra Credit requirements satisfied:
//   • The Live Hub:  connects to the .NET BookingHub at /hubs/booking.
//   • The Listener: registers handlers for booking AND room events and calls the
//                   appropriate callback when each fires.
//   • Memory leak prevention: the cleanup function returned by useEffect stops
//                   the connection when the component unmounts.
//
// Hook Discipline: all SignalR logic lives here — no hub code in components.
//
// JWT auth: SignalR cannot set HTTP headers on the WebSocket handshake, so the
// token is passed as ?access_token=... via the accessTokenFactory option.
// The backend JwtBearerEvents.OnMessageReceived reads it from the query string.

import { useEffect, useRef } from 'react';
import * as signalR from '@microsoft/signalr';

const HUB_URL = import.meta.env.VITE_HUB_URL ?? 'http://localhost:5230/hubs/booking';

/**
 * Establishes and maintains a SignalR connection to the BookingHub.
 *
 * Calls onBookingChange(eventName, data) when a booking is created or updated.
 * Calls onRoomChange(eventName, data) when a room is created, updated, or deleted.
 *
 * Automatically stops the connection when the consuming component unmounts.
 *
 * @param {{
 *   onBookingChange?: (eventName: string, data: Object) => void,
 *   onRoomChange?: (eventName: string, data: Object) => void
 * }} options
 */
function useSignalR({ onBookingChange, onRoomChange } = {}) {
  // Keep stable refs to the latest callbacks so the effect never needs to
  // re-run when the parent re-renders with new function references.
  const bookingCallbackRef = useRef(onBookingChange);
  const roomCallbackRef = useRef(onRoomChange);

  useEffect(() => { bookingCallbackRef.current = onBookingChange; });
  useEffect(() => { roomCallbackRef.current = onRoomChange; });

  useEffect(() => {
    // Build the connection — automatic reconnect keeps it alive across network blips.
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL, {
        // Pass the JWT so the hub respects [Authorize] if added later.
        // The backend reads this from context.Request.Query["access_token"].
        accessTokenFactory: () => localStorage.getItem('token') ?? '',
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    // ── Booking events ────────────────────────────────────────────────────────
    connection.on('BookingCreated', (data) => {
      bookingCallbackRef.current?.('BookingCreated', data);
    });
    connection.on('BookingUpdated', (data) => {
      bookingCallbackRef.current?.('BookingUpdated', data);
    });
    connection.on('BookingCancelled', (data) => {
      bookingCallbackRef.current?.('BookingCancelled', data);
    });
    connection.on('BookingDeleted', (data) => {
      bookingCallbackRef.current?.('BookingDeleted', data);
    });

    // ── Room events ───────────────────────────────────────────────────────────
    connection.on('RoomCreated', (data) => {
      roomCallbackRef.current?.('RoomCreated', data);
    });
    connection.on('RoomUpdated', (data) => {
      roomCallbackRef.current?.('RoomUpdated', data);
    });
    connection.on('RoomDeleted', (data) => {
      roomCallbackRef.current?.('RoomDeleted', data);
    });

    // Start the connection asynchronously.
    connection.start().catch((err) => {
      console.warn('[SignalR] Connection failed:', err.message);
    });

    // Cleanup: stop the connection when the component unmounts.
    // This prevents memory leaks and orphaned WebSocket connections.
    return () => {
      connection.stop();
    };
  }, []); // Runs once on mount — refs handle callback changes without re-running.
}

export default useSignalR;
