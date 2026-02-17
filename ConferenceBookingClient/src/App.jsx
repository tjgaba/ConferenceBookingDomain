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
import { bookings } from "./mockData";
import { rooms } from "./mockData";

function App() {
  // Mock data is imported from mockData.js
  // This simulates what will later come from the backend API via fetch/axios calls

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
