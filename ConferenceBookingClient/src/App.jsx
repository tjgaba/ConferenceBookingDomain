// App.jsx — The root component of our Conference Booking application.
// This is where we compose all of our components together.
//
// React is:
//   - Declarative: We describe WHAT the UI should look like, not HOW to update it.
//   - State-driven: Data determines what renders (today we use static data; state comes tomorrow).
//   - Component-based: UI is built from small, reusable pieces.
//
// React is NOT:
//   - Direct DOM manipulation (no document.getElementById or manual updates).
//
// Data flow: Data → Component → JSX → Virtual DOM → Real DOM
//
// Today's static data simulates what will later come from: React → API → PostgreSQL
// Tomorrow we introduce state, then effects, then API calls.
// The API endpoints we'll eventually connect to:
//   - GET /api/bookings
//   - GET /api/rooms

import Header from "./components/Header";
import BookingList from "./components/BookingList";
import RoomList from "./components/RoomList";
import Button from "./components/Button";
import Footer from "./components/Footer";

function App() {
  // Static data simulating what will later come from the backend API.
  // Each object has an "id" — this is used as the "key" when rendering lists.
  
  // Sample bookings from the Conference Booking API
  const bookings = [
    { 
      id: 1, 
      roomName: "Room A", 
      location: "London",
      startTime: "2026-03-15 09:00:00", 
      endTime: "2026-03-15 11:00:00",
      status: "Pending" 
    },
    { 
      id: 2, 
      roomName: "Room C", 
      location: "Cape Town",
      startTime: "2026-03-16 14:00:00", 
      endTime: "2026-03-16 16:00:00",
      status: "Confirmed" 
    },
    { 
      id: 3, 
      roomName: "Room D", 
      location: "Johannesburg",
      startTime: "2026-03-17 10:00:00", 
      endTime: "2026-03-17 12:00:00",
      status: "Confirmed" 
    },
  ];

  // Sample rooms from the Conference Booking
  const rooms = [
    { id: 1, name: "Room A", capacity: 10, location: "London", number: 101 },
    { id: 2, name: "Room B", capacity: 8, location: "London", number: 102 },
    { id: 3, name: "Room C", capacity: 15, location: "Cape Town", number: 201 },
    { id: 4, name: "Room D", capacity: 20, location: "Johannesburg", number: 301 },
  ];

  return (
    <div>
      {/* Header component — no props needed, just renders a title */}
      <Header />

      {/* BookingList receives the bookings array as a prop */}
      <BookingList bookings={bookings} />

      {/* Button is a reusable component — we configure it via the "label" prop */}
      <Button label="New Booking" />

      {/* RoomList receives the rooms array as a prop */}
      <RoomList rooms={rooms} />

      {/* Another button example showing reusability */}
      <Button label="Add Room" />

      {/* Footer component — displays copyright information */}
      <Footer />
    </div>
  );
}

export default App;
