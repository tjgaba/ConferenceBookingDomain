'use client';
// BookingList.jsx — Renders a list of BookingCard components.
//
// 'use client': accepts onEdit and onDelete function props and forwards them
// to BookingCard. In Next.js, Server Components cannot accept or pass functions
// as props — doing so would cross the server/client serialisation boundary.

import BookingCard from "./BookingCard";
import "./BookingList.css";

function BookingList({ bookings, onEdit, onDelete }) {
  // Pass both data AND event handlers to child components
  
  return (
    <div className="booking-list">
      <h2>
        Current Bookings ({bookings.length})
      </h2>
      {bookings.length === 0 ? (
        <p className="empty-message">No bookings yet. Create your first booking!</p>
      ) : (
        <div className="bookings-grid">
          {bookings.map((booking) => (
            <BookingCard 
              key={booking.bookingId || booking.id} 
              booking={booking}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default BookingList;
