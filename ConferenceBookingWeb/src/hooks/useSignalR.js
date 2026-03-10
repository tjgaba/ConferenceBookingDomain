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

import { useEffect, useRef, useState } from 'react';
import * as signalR from '@microsoft/signalr';

const HUB_URL = process.env.NEXT_PUBLIC_HUB_URL ?? 'http://localhost:5230/hubs/booking';

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
  const bookingCallbackRef = useRef(onBookingChange);
  const roomCallbackRef = useRef(onRoomChange);
  const [hasToken, setHasToken] = useState(
    () => typeof window !== 'undefined' && !!localStorage.getItem('token')
  );

  // Keep callback refs current so the effect doesn't need to re-run when they change.
  useEffect(() => { bookingCallbackRef.current = onBookingChange; }, [onBookingChange]);
  useEffect(() => { roomCallbackRef.current = onRoomChange; }, [onRoomChange]);

  // Sync hasToken with localStorage so we connect once the user logs in.
  useEffect(() => {
    const sync = () => setHasToken(!!localStorage.getItem('token'));
    window.addEventListener('storage', sync);
    // Also poll briefly after mount in case the token was set in the same tab.
    const id = setInterval(sync, 2000);
    return () => {
      window.removeEventListener('storage', sync);
      clearInterval(id);
    };
  }, []);

  useEffect(() => {
    // Don't connect until there is a valid token.
    if (!hasToken) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL, {
        accessTokenFactory: () => localStorage.getItem('token') ?? '',
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    const bookingEvents = ['BookingCreated', 'BookingUpdated', 'BookingCancelled'];
    const roomEvents    = ['RoomCreated',    'RoomUpdated',    'RoomDeleted'];

    bookingEvents.forEach(evt =>
      connection.on(evt, data => bookingCallbackRef.current?.(evt, data))
    );
    roomEvents.forEach(evt =>
      connection.on(evt, data => roomCallbackRef.current?.(evt, data))
    );

    connection.start().catch(err => console.error('SignalR connection error:', err));

    return () => {
      connection.stop();
    };
  }, [hasToken]);
}

export default useSignalR;
