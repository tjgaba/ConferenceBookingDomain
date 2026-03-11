'use client';
// app/bookings/[id]/BookingDetailClient.tsx — Booking Detail View (Client Component)
//
// 'use client': uses useState + useEffect to fetch data after mount.
// The fetch requires a JWT stored in localStorage, which is only available
// in the browser — making a Server Component fetch impossible here.
//
// Not-Found Handling:
//   The .NET API returns HTTP 404 when the booking ID does not exist.
//   Axios throws on 4xx/5xx, so we catch and check error.response.status.
//   A custom branded message is shown instead of the global Next.js 404 page.

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getBookingById } from '../../../src/services/bookingService';
import './booking-detail.css';

interface BookingDetail {
  bookingId: number;
  roomId: number;
  roomName: string;
  roomNumber: number;
  location: string;
  isRoomActive: boolean;
  requestedBy: string;
  startTime: string;
  endTime: string;
  status: string;
  capacity: number;
  createdAt: string;
  cancelledAt: string | null;
}

export default function BookingDetailClient({ id }: { id: string }) {
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        // getBookingById uses apiClient which attaches the JWT from localStorage
        // and returns response.data directly (response interceptor unwraps it).
        // params.id is always a string from the URL — parse to number for the service.
        const numericId = parseInt(id, 10);
        const data = await getBookingById(numericId);
        if (!cancelled) setBooking(data as BookingDetail);
      } catch (err: unknown) {
        if (cancelled) return;
        // Axios wraps HTTP errors — the original response is on err.response
        const status = (err as { response?: { status?: number } })?.response?.status;
        if (status === 404) {
          setNotFound(true);
        } else {
          const msg = (err as { message?: string })?.message ?? 'An unexpected error occurred.';
          setError(msg);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <div className="booking-detail-loading">
        <div className="loading-spinner" aria-label={`Loading booking #${id}`} />
        <p>Loading booking #{id}…</p>
      </div>
    );
  }

  // ── Custom Not-Found View ────────────────────────────────────────────────
  if (notFound) {
    return (
      <div className="booking-detail-notfound">
        <div className="notfound-icon" aria-hidden="true">🔍</div>
        <h1>Booking Not Found</h1>
        <p>
          No booking exists with ID <strong>#{id}</strong>. It may have been
          deleted or the ID may be incorrect.
        </p>
        <Link href="/dashboard/bookings" className="notfound-back">
          ← Back to Bookings
        </Link>
      </div>
    );
  }

  // ── General Error View ───────────────────────────────────────────────────
  if (error) {
    return (
      <div className="booking-detail-notfound">
        <div className="notfound-icon" aria-hidden="true">⚠️</div>
        <h1>Something Went Wrong</h1>
        <p>{error}</p>
        <Link href="/dashboard/bookings" className="notfound-back">
          ← Back to Bookings
        </Link>
      </div>
    );
  }

  if (!booking) return null;

  const fmt = (dt: string) => new Date(dt).toLocaleString();
  const statusClass = `status-badge status-${booking.status.toLowerCase()}`;

  // ── Booking Detail View ──────────────────────────────────────────────────
  return (
    <div className="booking-detail">
      <div className="booking-detail-header">
        <Link href="/dashboard/bookings" className="back-link">← Back to Bookings</Link>
        <div className="booking-detail-title">
          <h1>Booking <span className="booking-id">#{booking.bookingId}</span></h1>
          <span className={statusClass}>{booking.status}</span>
        </div>
      </div>

      <div className="booking-detail-grid">
        <div className="detail-card">
          <h2>Room</h2>
          <dl className="detail-list">
            <div className="detail-row">
              <dt>Name</dt>
              <dd>{booking.roomName}</dd>
            </div>
            <div className="detail-row">
              <dt>Number</dt>
              <dd>#{booking.roomNumber}</dd>
            </div>
            <div className="detail-row">
              <dt>Location</dt>
              <dd>{booking.location}</dd>
            </div>
            <div className="detail-row">
              <dt>Capacity</dt>
              <dd>{booking.capacity} people</dd>
            </div>
            <div className="detail-row">
              <dt>Room Active</dt>
              <dd>{booking.isRoomActive ? '✅ Yes' : '❌ No'}</dd>
            </div>
          </dl>
        </div>

        <div className="detail-card">
          <h2>Booking</h2>
          <dl className="detail-list">
            <div className="detail-row">
              <dt>Booking ID</dt>
              <dd>#{booking.bookingId}</dd>
            </div>
            <div className="detail-row">
              <dt>Requested By</dt>
              <dd>{booking.requestedBy}</dd>
            </div>
            <div className="detail-row">
              <dt>Start Time</dt>
              <dd>{fmt(booking.startTime)}</dd>
            </div>
            <div className="detail-row">
              <dt>End Time</dt>
              <dd>{fmt(booking.endTime)}</dd>
            </div>
            <div className="detail-row">
              <dt>Created At</dt>
              <dd>{fmt(booking.createdAt)}</dd>
            </div>
            {booking.cancelledAt && (
              <div className="detail-row">
                <dt>Cancelled At</dt>
                <dd>{fmt(booking.cancelledAt)}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </div>
  );
}
