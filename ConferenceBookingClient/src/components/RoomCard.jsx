// RoomCard.jsx — Displays a single conference room with interactive buttons.
// 
// EVENT HANDLERS:
//   - onEdit and onDelete are passed from parent components
//   - These handlers are defined in App.jsx where state is managed
//   - Demonstrates "Lifting State Up" pattern

import Button from "./Button";
import "./RoomCard.css";

function RoomCard({ room, onEdit, onDelete }) {
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
      <div className="room-card-actions">
        {/* Event Handler: Call onEdit when clicked */}
        <Button 
          label="Edit" 
          variant="primary"
          onClick={() => onEdit(room)}
        />
        {/* Event Handler: Call onDelete when clicked */}
        <Button 
          label="Delete" 
          variant="danger"
          onClick={() => onDelete(room.id)}
        />
      </div>
    </div>
  );
}

export default RoomCard;
