// BookingList.jsx — Renders a list of BookingCard components.
// This demonstrates:
//
// 1. Component Composition: BookingList uses BookingCard inside it.
// 2. Props Passing: Receives handlers from parent (App) and passes them down to BookingCard
// 3. LIFTING STATE UP: Handlers defined in App, passed through BookingList to BookingCard
//    This allows BookingCard to trigger changes in App's state
// 4. Rendering Lists: Uses .map() with unique keys for efficient rendering

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
