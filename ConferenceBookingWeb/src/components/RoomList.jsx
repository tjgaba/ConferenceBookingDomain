'use client';
// RoomList.jsx — Renders a list of RoomCard components.
//
// 'use client': accepts onEdit and onDelete function props and forwards them
// to RoomCard. Functions cannot cross the server/client serialisation boundary.

import { memo } from 'react';
import RoomCard from "./RoomCard";
import "./RoomList.css";

const RoomList = memo(function RoomList({ rooms, onEdit, onDelete }) {
  return (
    <div className="room-list">
      <h2>
        Available Rooms ({rooms.length})
      </h2>
      {rooms.length === 0 ? (
        <p className="empty-message">No rooms yet. Add your first room!</p>
      ) : (
        <div className="rooms-grid">
          {rooms.map((room) => (
            <RoomCard 
              key={room.id} 
              room={room}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
});

export default RoomList;
