// RoomList.jsx — Renders a list of RoomCard components.
// This follows the same pattern as BookingList:
//   - Receives an array of data as props
//   - Uses .map() to render child components
//   - Assigns unique keys to each child
//
// This demonstrates code reusability patterns:
//   The BookingList and RoomList components are structurally similar,
//   but render different types of data using different child components.

import RoomCard from "./RoomCard";
import "./RoomList.css";

function RoomList({ rooms }) {
  return (
    <div className="room-list">
      <h2>
        Available Rooms
      </h2>
      <div className="rooms-grid">
        {rooms.map((room) => (
          // key={room.id} ensures React can efficiently track each room in the list
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
    </div>
  );
}

export default RoomList;
