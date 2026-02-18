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
//
// PERSISTENCE (localStorage):
//   - Data is saved to browser's localStorage on every change
//   - Data is loaded from localStorage on app mount
//   - Survives page refresh and browser restart

import { useState, useEffect } from "react";
import Header from "./components/Header";
import BookingList from "./components/BookingList";
import RoomList from "./components/RoomList";
import BookingForm from "./components/BookingForm";
import RoomForm from "./components/RoomForm";
import Button from "./components/Button";
import Footer from "./components/Footer";
import { bookings as initialBookings, rooms as initialRooms } from "./Data/mockData";
import { loadBookings, saveBookings, loadRooms, saveRooms } from "./Data/localStorage";
import "./App.css";

function App() {
  // STATE: Managing bookings array
  // Initialize from localStorage, fallback to mockData if nothing stored
  const [bookings, setBookings] = useState(() => loadBookings(initialBookings));
  
  // STATE: Managing rooms array
  // Initialize from localStorage, fallback to mockData if nothing stored
  const [rooms, setRooms] = useState(() => loadRooms(initialRooms));
  
  // EFFECT: Save bookings to localStorage whenever they change
  // useEffect runs AFTER render, perfect for side effects like storage
  useEffect(() => {
    saveBookings(bookings);
  }, [bookings]); // Dependency array: run when bookings changes
  
  // EFFECT: Save rooms to localStorage whenever they change
  useEffect(() => {
    saveRooms(rooms);
  }, [rooms]); // Dependency array: run when rooms changes
  
  // STATE: Controlling form visibility  
  // STATE: Tracking which item is being edited (null = not editing)
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showRoomForm, setShowRoomForm] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [editingRoom, setEditingRoom] = useState(null);

  // EVENT HANDLER: Add or update a booking. Submit Function Defined 
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

      {/* Dashboard Statistics - Derived State */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Bookings</h3>
          <p className="stat-number">{bookings.length}</p>
        </div>
        <div className="stat-card">
          <h3>Total Available Rooms</h3>
          <p className="stat-number">{rooms.length}</p>
        </div>
      </div>

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
            onSubmit={handleBookingSubmit} //Submit Function Passed as Prop to BookingForm
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
