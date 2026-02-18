// App.jsx — The root component with ASYNC STATE MANAGEMENT and LIFECYCLE CONTROL.
//
// COMPONENT LIFECYCLE:
//   - Mount: Component initializes, fetches data from "server"
//   - Update: Re-renders when state changes
//   - Unmount: Cleanup functions cancel pending operations
//
// RESILIENT STATE PATTERN:
//   - Data (bookings, rooms)
//   - Loading (isLoading, isSubmitting)
//   - Error (error)
//
// ASYNC OPERATIONS:
//   - All CRUD operations simulate network latency (500-2000ms)
//   - 15% random failure rate to test error handling
//   - AbortController prevents memory leaks on unmount
//
// HOOK DISCIPLINE:
//   - useEffect dependencies prevent infinite loops
//   - Cleanup functions stop background processes
//   - Race condition prevention with AbortController
//
// Data flow: User Action → Async API Call → Loading State → Success/Error → UI Update

import { useState, useEffect } from "react";
import Header from "./components/Header";
import BookingList from "./components/BookingList";
import RoomList from "./components/RoomList";
import BookingForm from "./components/BookingForm";
import RoomForm from "./components/RoomForm";
import Button from "./components/Button";
import Footer from "./components/Footer";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorMessage from "./components/ErrorMessage";
import * as bookingService from "./services/bookingService";
import * as roomService from "./services/roomService";
import "./App.css";

function App() {
  // ==================== RESILIENT STATE ====================
  // Data state
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  
  // Loading states (track multiple operations independently)
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Error state
  const [error, setError] = useState(null);
  
  // UI state  
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showRoomForm, setShowRoomForm] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [editingRoom, setEditingRoom] = useState(null);

  // ==================== COMPONENT LIFECYCLE (Mount, Update, Unmount) ====================
  
  // EFFECT: Fetch initial data on component mount
  // This demonstrates proper async data fetching with cleanup
  useEffect(() => {
    // AbortController allows us to cancel the fetch if component unmounts
    const abortController = new AbortController();
    let isMounted = true; // Flag to prevent state updates after unmount

    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch bookings and rooms in parallel for better performance
        const [bookingsData, roomsData] = await Promise.all([
          bookingService.fetchAllBookings(),
          roomService.fetchAllRooms()
        ]);

        // Only update state if component is still mounted
        // This prevents "Can't perform a React state update on an unmounted component" warnings
        if (isMounted && !abortController.signal.aborted) {
          setBookings(bookingsData);
          setRooms(roomsData);
        }
      } catch (err) {
        // Only set error if component is still mounted
        if (isMounted && !abortController.signal.aborted) {
          setError(err);
          console.error('Failed to fetch initial data:', err);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
         } // Fecth is done, whether success or error, stop loading state
      }
    } ;

    fetchInitialData();

    // CLEANUP FUNCTION: Called when component unmounts
    // This prevents memory leaks by canceling pending operations
    return () => {
      isMounted = false;
      abortController.abort();
      console.log('🧹 Cleanup: Aborted pending fetch operations');
    };
  }, []); // Empty dependency array = run once on mount

  // ==================== ASYNC EVENT HANDLERS ====================

  // HANDLER: Create or update a booking
  const handleBookingSubmit = async (bookingData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      if (editingBooking) {
        // Update existing booking
        const updated = await bookingService.updateBooking(bookingData);
        setBookings(bookings.map(b => 
          b.id === updated.id ? updated : b
        ));
        setEditingBooking(null);
      } else {
        // Create new booking
        const created = await bookingService.createBooking(bookingData);
        setBookings([...bookings, created]);
      }
      
      setShowBookingForm(false);
    } catch (err) {
      setError(err);
      console.error('Booking operation failed:', err);
      // Don't close form on error so user can retry
    } finally {
      setIsSubmitting(false);
    }
  };

  // HANDLER: Delete a booking
  const handleDeleteBooking = async (bookingId) => {
    if (!confirm("Are you sure you want to delete this booking?")) {
      return;
    }

    try {
      setError(null);
      await bookingService.deleteBooking(bookingId);
      
      // Optimistic update: remove from UI immediately
      setBookings(bookings.filter(b => b.id !== bookingId));
    } catch (err) {
      setError(err);
      console.error('Delete booking failed:', err);
      // Could implement rollback here in production
    }
  };

  // HANDLER: Start editing a booking
  const handleEditBooking = (booking) => {
    setEditingBooking(booking);
    setShowBookingForm(true);
  };

  // HANDLER: Create or update a room
  const handleRoomSubmit = async (roomData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      if (editingRoom) {
        // Update existing room
        const updated = await roomService.updateRoom(roomData);
        setRooms(rooms.map(r => 
          r.id === updated.id ? updated : r
        ));
        setEditingRoom(null);
      } else {
        // Create new room
        const created = await roomService.createRoom(roomData);
        setRooms([...rooms, created]);
      }
      
      setShowRoomForm(false);
    } catch (err) {
      setError(err);
      console.error('Room operation failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // HANDLER: Delete a room
  const handleDeleteRoom = async (roomId) => {
    if (!confirm("Are you sure you want to delete this room?")) {
      return;
    }

    try {
      setError(null);
      await roomService.deleteRoom(roomId);
      
      setRooms(rooms.filter(r => r.id !== roomId));
    } catch (err) {
      setError(err);
      console.error('Delete room failed:', err);
    }
  };

  // HANDLER: Start editing a room
  const handleEditRoom = (room) => {
    setEditingRoom(room);
    setShowRoomForm(true);
  };
  
  // HANDLER: Cancel form (hide and reset editing state)
  const handleCancelBookingForm = () => {
    setShowBookingForm(false);
    setEditingBooking(null);
  };
  
  const handleCancelRoomForm = () => {
    setShowRoomForm(false);
    setEditingRoom(null);
  };

  // HANDLER: Retry fetching data after error
  const handleRetry = () => {
    window.location.reload(); // Simple retry by reloading
  };

  // HANDLER: Dismiss error message
  const handleDismissError = () => {
    setError(null);
  };

  // ==================== RENDER ====================

  // Show full-screen loader during initial data fetch
  if (isLoading) {
    return <LoadingSpinner overlay message="Loading dashboard..." />;
   } // Show error state if initial fetch failed and we have no data to display

  // Show error state if initial fetch failed
  if (error && bookings.length === 0 && rooms.length === 0) {
    return (
      <div className="app-container">
        <Header />
        <ErrorMessage 
          error={error}
          onRetry={handleRetry}
          onDismiss={handleDismissError}
        />
      </div>
     );// Show error banner if we have data but an operation failed (handled in main render below)
  }

  return (
    <div className="app-container">
      <Header />

      {/* Show error banner if operations fail (but data exists) */}
      {error && (
        <ErrorMessage 
          error={error}
          onDismiss={handleDismissError}
        />
      )}

      {/* Show overlay loader during submit operations */}
      {isSubmitting && <LoadingSpinner overlay message="Saving..." />}

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
            disabled={isSubmitting}
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
            disabled={isSubmitting}
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
