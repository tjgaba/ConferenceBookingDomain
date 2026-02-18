// App.jsx — The root component with STATE MANAGEMENT and EVENT HANDLERS.
//
// LIFTING STATE UP:
//   - State is managed here (in the parent component)
//   - Child components receive data via props
//   - Child components call handler functions (passed as props) to update parent's state
//   - This enables sibling components to share data
//
// STATE (useState):
//   - Component memory that persists between renders
//   - When state changes, React re-renders the component
//   - State updates are asynchronous
//
// EVENT HANDLERS:
//   - Functions that respond to user actions (clicks, form submissions, etc.)
//   - Defined in the parent and passed down as props
//   - Enable interactive behavior
//
// Data flow: User Action → Event Handler → State Update → Re-render → UI Update

import { useState } from "react";
import Header from "./components/Header";
import BookingList from "./components/BookingList";
import RoomList from "./components/RoomList";
import BookingForm from "./components/BookingForm";
import RoomForm from "./components/RoomForm";
import Button from "./components/Button";
import Footer from "./components/Footer";
import { bookings as initialBookings, rooms as initialRooms } from "./Data/mockData";
import "./App.css";

function App() {
  // STATE: Managing bookings array
  // useState returns [currentValue, setterFunction]
  const [bookings, setBookings] = useState(initialBookings);
  
  // STATE: Managing rooms array
  const [rooms, setRooms] = useState(initialRooms);
  
  // STATE: Controlling form visibility  
  // STATE: Tracking which item is being edited (null = not editing)
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showRoomForm, setShowRoomForm] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [editingRoom, setEditingRoom] = useState(null);

  // EVENT HANDLER: Add or update a booking
  const handleBookingSubmit = (bookingData) => {
    if (editingBooking) {
      // Update existing booking
      setBookings(bookings.map(b => 
        b.id === bookingData.id ? bookingData : b
      ));
      setEditingBooking(null);
    } else {
      // Add new booking
      setBookings([...bookings, bookingData]);
    }
    setShowBookingForm(false);
  };

  // EVENT HANDLER: Delete a booking
  const handleDeleteBooking = (bookingId) => {
    if (confirm("Are you sure you want to delete this booking?")) {
      setBookings(bookings.filter(b => b.id !== bookingId));
    }
  };

  // EVENT HANDLER: Start editing a booking
  const handleEditBooking = (booking) => {setEditingBooking(booking);setShowBookingForm(true);  };

  // EVENT HANDLER: Add or update a room
  const handleRoomSubmit = (roomData) => {
    if (editingRoom) {
      // Update existing room
      setRooms(rooms.map(r => 
        r.id === roomData.id ? roomData : r
      ));
      setEditingRoom(null);
    } else {
      // Add new room
      setRooms([...rooms, roomData]);
    }
    setShowRoomForm(false);
  };

  // EVENT HANDLER: Delete a room
  const handleDeleteRoom = (roomId) => {
    if (confirm("Are you sure you want to delete this room?")) { 
      setRooms(rooms.filter(r => r.id !== roomId));
    }
  };

  // EVENT HANDLER: Start editing a room
  const handleEditRoom = (room) => {setEditingRoom(room);setShowRoomForm(true); };
  
  // EVENT HANDLER: Cancel form (hide and reset editing state)
  const handleCancelBookingForm = () => {setShowBookingForm(false);setEditingBooking(null); };
  const handleCancelRoomForm = () => {setShowRoomForm(false);setEditingRoom(null); };

  return (
    <div className="app-container">
      <Header />

      {/* Bookings Section */}
      <section className="section">
        <div className="section-header">
          <h2>Bookings Management</h2>
          <Button 
            label={showBookingForm ? "Hide Form" : "New Booking"} 
            variant="primary"
            onClick={() => {
              setShowBookingForm(!showBookingForm);
              setEditingBooking(null);
            }}
          />
        </div>

        {/* Conditionally render BookingForm */}
        {showBookingForm && (
          <BookingForm 
            onSubmit={handleBookingSubmit}
            onCancel={handleCancelBookingForm}
            rooms={rooms}
            initialData={editingBooking}
          />
        )}

        {/* Pass data AND handlers to child via props (Lifting State Up) */}
        <BookingList 
          bookings={bookings}
          onEdit={handleEditBooking}
          onDelete={handleDeleteBooking}
        />
      </section>

      {/* Rooms Section */}
      <section className="section">
        <div className="section-header">
          <h2>Rooms Management</h2>
          <Button 
            label={showRoomForm ? "Hide Form" : "Add Room"} 
            variant="success"
            onClick={() => {
              setShowRoomForm(!showRoomForm);
              setEditingRoom(null);
            }}
          />
        </div>

        {/* Conditionally render RoomForm */}
        {showRoomForm && (
          <RoomForm 
            onSubmit={handleRoomSubmit}
            onCancel={handleCancelRoomForm}
            initialData={editingRoom}
          />
        )}

        {/* Pass data AND handlers to child via props */}
        <RoomList 
          rooms={rooms}
          onEdit={handleEditRoom}
          onDelete={handleDeleteRoom}
        />
      </section>

      <Footer />
    </div>
  );
}

export default App;
