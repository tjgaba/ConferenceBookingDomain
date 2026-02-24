// BookingCard.jsx — Displays a single booking with interactive buttons.
// 
// EVENT HANDLERS:
//   - onEdit and onDelete are passed from parent components (via props)
//   - When user clicks Edit/Delete, we call these handlers
//   - The handlers are defined in App.jsx (where state lives)
//   - This is "Lifting State Up" — child components don't manage data, they request changes
//
// PROPS FLOW:
//   App → BookingList → BookingCard
//   Data and handlers flow down through props

import Button from "./Button";
import "./BookingCard.css";

function BookingCard({ booking, onEdit, onDelete }) {
  return (
    <div className="booking-card">
      <h3>
        {booking.roomName} - {booking.location}
      </h3>
      <p>
        <strong>Room:</strong> {booking.roomName} ({booking.location})
      </p>
      <p>
        <strong>Time:</strong> {booking.startTime} to {booking.endTime}
      </p>
      <p>
        <span className={`booking-status status-${booking.status.toLowerCase()}`}>
          {booking.status}
        </span>
      </p>
      <div className="booking-card-actions">
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
