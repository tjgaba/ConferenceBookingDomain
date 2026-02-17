// RoomCard.jsx — Displays a single conference room.
// This is another example of a presentational component that receives props
// and returns JSX describing what should be displayed.
// Notice how similar its structure is to BookingCard, but adapted for room data.

import "./RoomCard.css";

function RoomCard({ room }) {
  // Destructure the room prop to access its properties
  
  return (
    <div className="room-card">
      <h3>
        {room.name}
      </h3>
      <p>
        <strong>Location:</strong> {room.location}
      </p>
      <p>
        <strong>Room Number:</strong> {room.number}
      </p>
      <p>
        <strong>Capacity:</strong> {room.capacity} people
      </p>
    </div>
  );
}

export default RoomCard;
