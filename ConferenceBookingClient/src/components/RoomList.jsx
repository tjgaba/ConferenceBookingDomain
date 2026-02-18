// RoomList.jsx — Renders a list of RoomCard components.
// This follows the same pattern as BookingList:
//   - Receives data and handlers from parent (App)
//   - Passes both down to child components (RoomCard)
//   - LIFTING STATE UP: All state management happens in App

import RoomCard from "./RoomCard";
import "./RoomList.css";

function RoomList({ rooms, onEdit, onDelete }) {
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
}

export default RoomList;
