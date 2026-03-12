'use client';
// RoomCard.jsx — Displays a single conference room with interactive buttons.
//
// 'use client': renders <Button onClick={() => onEdit(room)}> —
// inline arrow functions as event handlers require the browser.

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
      {(onEdit || onDelete) && (
        <div className="room-card-actions">
          {onEdit && (
            <Button 
              label="Edit" 
              variant="primary"
              onClick={() => onEdit(room)}
            />
          )}
          {onDelete && (
            <Button 
              label="Delete" 
              variant="danger"
              onClick={() => onDelete(room.id)}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default RoomCard;
