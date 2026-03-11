'use client';
// BookingCard.jsx — Displays a single booking with interactive buttons.
//
// 'use client': renders <Button onClick={() => onEdit(booking)}> —
// inline arrow functions as event handlers require the browser.

import Link from "next/link";
import Button from "./Button";
import "./BookingCard.css";

function BookingCard({ booking, onEdit, onDelete }) {
  const fmt = (iso) =>
    iso ? new Date(iso).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : '—';

  return (
    <div className="booking-card">
      <h3>
        {booking.roomName} - {booking.location}
      </h3>
      <p>
        <strong>Room:</strong> {booking.roomName} ({booking.location})
      </p>
      <p>
        <strong>Time:</strong> {fmt(booking.startTime)} to {fmt(booking.endTime)}
      </p>
      <p>
        <span className={`booking-status status-${booking.status.toLowerCase()}`}>
          {booking.status}
        </span>
      </p>
      <div className="booking-card-actions">
        {/* Navigate to the booking detail page */}
        <Link href={`/bookings/${booking.bookingId || booking.id}`} className="btn-view-details">
          View Details
        </Link>
        {/* Event Handler: Call onEdit when clicked */}
        <Button 
          label="Edit" 
          variant="primary"
          onClick={() => onEdit(booking)}
        />
        {/* Event Handler: Call onDelete when clicked */}
        <Button 
          label="Delete" 
          variant="danger"
          onClick={() => onDelete(booking.bookingId || booking.id)}
        />
      </div>
    </div>
  );
}

export default BookingCard;
