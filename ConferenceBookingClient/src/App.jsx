// App.jsx — The root component with ASYNC STATE MANAGEMENT and LIFECYCLE CONTROL.
//
// COMPONENT LIFECYCLE: (line 84)
//   - Mount: Component initializes, fetches data from "server"
//   - Update: Re-renders when state changes
//   - Unmount: Cleanup functions cancel pending operations
//
// RESILIENT STATE PATTERN: (line 44)
//   - Data (bookings, rooms)
//   - Loading (isLoading, isSubmitting)
//   - Error (error)
//
// ASYNC OPERATIONS: (line 242)
//   - All CRUD operations simulate network latency (500-2000ms)
//   - 15% random failure rate to test error handling
//   - AbortController prevents memory leaks on unmount
//
// HOOK DISCIPLINE: (line 171)
//   - useEffect dependencies prevent infinite loops
//   - Cleanup functions stop background processes
//   - Race condition prevention with AbortController
//
// Data flow: User Action → Async API Call → Loading State → Success/Error → UI Update (line 456)

import { useState, useEffect, useMemo } from "react";
import Header from "./components/Header";
import BookingList from "./components/BookingList";
import RoomList from "./components/RoomList";
import BookingForm from "./components/BookingForm";
import RoomForm from "./components/RoomForm";
import LoginForm from "./components/LoginForm";
import Button from "./components/Button";
import Footer from "./components/Footer";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorMessage from "./components/ErrorMessage";
import Toast from "./components/Toast";
import * as bookingService from "./services/bookingService";
import * as roomService from "./services/roomService";
import { authService } from "./services/authService";
import NetworkStressTest from "./components/NetworkStressTest";
import "./App.css";

function App() {
  // ==================== RESILIENT STATE ====================
  // Data state
  const [allBookings, setAllBookings] = useState([]); // Unfiltered complete data
  const [filteredBookings, setFilteredBookings] = useState([]); // Filtered data for display
  const [allRooms, setAllRooms] = useState([]); // Unfiltered room data
  const [filteredRooms, setFilteredRooms] = useState([]); // Filtered room data for display
  
  // Filter state - Bookings
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");
  
  // Filter state - Rooms
  const [roomCapacityFilter, setRoomCapacityFilter] = useState("All");
  const [roomLocationFilter, setRoomLocationFilter] = useState("All");
  
  // Loading states (track multiple operations independently)
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Error state
  const [error, setError] = useState(null);
  
  // Toast notification state
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  
  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(authService.isAuthenticated());
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());
  const [showLoginForm, setShowLoginForm] = useState(false);

  // Req 5: Field-level server errors parsed from ProblemDetails, passed to BookingForm.
  const [bookingFormErrors, setBookingFormErrors] = useState({});
  // Incrementing this forces the data-fetch effect to re-run even when
  // isLoggedIn was already true (e.g. stale token replaced by fresh login).
  const [refreshKey, setRefreshKey] = useState(0);
  
  // UI state  
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showRoomForm, setShowRoomForm] = useState(false);
  const [showStressTest, setShowStressTest] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [editingRoom, setEditingRoom] = useState(null);

  // ==================== COMPONENT LIFECYCLE (Mount, Update, Unmount) ====================

  // EFFECT: Req 8 — Listen for 401 Unauthorized events dispatched by the Axios
  // response interceptor. Clears auth state and shows the login form globally
  // so the user is never silently stuck on a dead session.
  useEffect(() => {
    const handleUnauthorized = () => {
      setIsLoggedIn(false);
      setCurrentUser(null);
      setShowLoginForm(true);
      setToast({ show: true, message: 'Session expired. Please log in again.', type: 'error' });
    };
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  // EFFECT: Fetch initial data — runs on mount and whenever login state changes.
  // If the user is not logged in, skip the fetch and clear loading immediately.
  useEffect(() => {
    if (!isLoggedIn) {
      setIsLoading(false);
      setAllBookings([]);
      setAllRooms([]);
      setFilteredBookings([]);
      setFilteredRooms([]);
      return;
    }

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
          setAllBookings(bookingsData); // Store complete unfiltered data
          setFilteredBookings(bookingsData); // Initially show all bookings
          setAllRooms(roomsData); // Store complete unfiltered room data
          setFilteredRooms(roomsData); // Initially show all rooms
          
          // Show success toast notification
          setToast({
            show: true,
            message: `Data Sync Successful! Loaded ${bookingsData.length} bookings and ${roomsData.length} rooms.`,
            type: 'success'
          });
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
  }, [isLoggedIn, refreshKey]); // Re-run on login state change OR explicit refresh after re-login

  // ==================== CASCADING DERIVED STATE ====================
  
  // MEMO: Extract unique locations from bookings for filter dropdown
  // useMemo prevents recalculating on every render - only when allBookings changes
  const uniqueLocations = useMemo(() => {
    const locations = allBookings
      .map(b => b.location)
      .filter(location => location); // Remove null/undefined
    return [...new Set(locations)].sort(); // Remove duplicates and sort
  }, [allBookings]);

  // MEMO: Extract unique locations from rooms for filter dropdown
  const uniqueRoomLocations = useMemo(() => {
    const locations = allRooms
      .map(r => r.location)
      .filter(location => location); // Remove null/undefined
    return [...new Set(locations)].sort(); // Remove duplicates and sort
  }, [allRooms]);

  // ==================== DEPENDENCY ARRAY DISCIPLINE ====================
  
  // EFFECT: Filter bookings when category OR location changes (Cascading Filters)
  // This demonstrates proper dependency management to avoid infinite loops
  // 
  // CRITICAL: We filter from `allBookings` (source data) and set `filteredBookings` (display data)
  // We do NOT include `filteredBookings` in dependencies because we're setting it
  // We DO include `categoryFilter`, `locationFilter`, and `allBookings` because we read from them
  useEffect(() => {
    console.log(`🔍 Filtering bookings by category: "${categoryFilter}", location: "${locationFilter}"`);
    
    let result = allBookings;
    
    // STEP 1: Filter by category
    if (categoryFilter === "All") {
      result = allBookings;
    } else if (categoryFilter === "Pending") {
      result = allBookings.filter(b => b.status === "Pending");
    } else if (categoryFilter === "Confirmed") {
      result = allBookings.filter(b => b.status === "Confirmed");
    } else if (categoryFilter === "Cancelled") {
      result = allBookings.filter(b => b.status === "Cancelled");
    } else if (categoryFilter === "By Location") {
      // Sort by location alphabetically
      result = [...allBookings].sort((a, b) => 
        (a.location || "").localeCompare(b.location || "")
      );
    }
    
    // STEP 2: Filter by location (cascading filter)
    if (locationFilter !== "All") {
      result = result.filter(b => b.location === locationFilter);
    }
    
    setFilteredBookings(result);
    console.log(`✓ Filtered: ${result.length} bookings displayed`);
    
  }, [categoryFilter, locationFilter, allBookings]); // Only re-run when filters or source data changes
  // WARNING: Do NOT add filteredBookings to dependencies - that would cause infinite loop!

  // EFFECT: Filter rooms when capacity OR location changes (Cascading Filters)
  useEffect(() => {
    console.log(`🏢 Filtering rooms by capacity: "${roomCapacityFilter}", location: "${roomLocationFilter}"`);
    
    let result = allRooms;
    
    // STEP 1: Filter by capacity
    if (roomCapacityFilter === "All") {
      result = allRooms;
    } else if (roomCapacityFilter === "Small") {
      result = allRooms.filter(r => r.capacity < 10);
    } else if (roomCapacityFilter === "Medium") {
      result = allRooms.filter(r => r.capacity >= 10 && r.capacity <= 15);
    } else if (roomCapacityFilter === "Large") {
      result = allRooms.filter(r => r.capacity > 15);
    } else if (roomCapacityFilter === "By Capacity") {
      // Sort by capacity ascending
      result = [...allRooms].sort((a, b) => a.capacity - b.capacity);
    }
    
    // STEP 2: Filter by location (cascading filter)
    if (roomLocationFilter !== "All") {
      result = result.filter(r => r.location === roomLocationFilter);
    }
    
    setFilteredRooms(result);
    console.log(`✓ Filtered: ${result.length} rooms displayed`);
    
  }, [roomCapacityFilter, roomLocationFilter, allRooms]);
  // WARNING: Do NOT add filteredRooms to dependencies - that would cause infinite loop!

  // ==================== ASYNC EVENT HANDLERS ====================

  // HANDLER: Create or update a booking
  const handleBookingSubmit = async (bookingData) => {
    // Clear stale field errors from previous attempt
    setBookingFormErrors({});
    try {
      setIsSubmitting(true);
      setError(null);

      if (editingBooking) {
        // Update existing booking
        const bookingId = bookingData.bookingId || editingBooking.id;
        await bookingService.updateBooking(bookingId, bookingData);
        // Pessimistic Update (Req 3): re-fetch list to reflect server state
        const refreshed = await bookingService.fetchAllBookings();
        setAllBookings(refreshed);
        setShowBookingForm(false);
        setEditingBooking(null);
        setToast({ show: true, message: 'Booking updated successfully!', type: 'success' });
      } else {
        // Create new booking
        await bookingService.createBooking(bookingData);
        // Pessimistic Update (Req 3): re-fetch list to reflect server state
        const refreshed = await bookingService.fetchAllBookings();
        setAllBookings(refreshed);
        setShowBookingForm(false);
        setToast({ show: true, message: 'Booking created successfully!', type: 'success' });
      }
    } catch (err) {
      // Req 5: Parse .NET ProblemDetails / validation error object and map to
      // specific form fields so errors appear directly under the relevant input.
      const data = err.response?.data;
      if (data?.errors) {
        // ModelState / FluentValidation errors: { errors: { RoomId: ['...'], StartDate: ['...'] } }
        const mapped = {};
        if (data.errors.RoomId)     mapped.roomId    = data.errors.RoomId[0];
        if (data.errors.StartDate)  mapped.startTime = data.errors.StartDate[0];
        if (data.errors.StartTime)  mapped.startTime = data.errors.StartTime[0];
        if (data.errors.EndDate)    mapped.endTime   = data.errors.EndDate[0];
        if (data.errors.EndTime)    mapped.endTime   = data.errors.EndTime[0];
        if (data.errors.Capacity)   mapped.general   = data.errors.Capacity[0];
        setBookingFormErrors(mapped);
      } else {
        // Single-message error (our BadRequest(new { message = ... }) responses)
        setBookingFormErrors({ general: data?.message || data?.title || err.message });
      }
      setError(err);
      console.error('Booking operation failed:', err);
      // Keep the form open so the user can correct the highlighted fields
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
      setAllBookings(allBookings.filter(b => (b.bookingId || b.id) !== bookingId));
      setToast({ show: true, message: 'Booking deleted successfully!', type: 'success' });
    } catch (err) {
      setError(err);
      console.error('Delete booking failed:', err);
      // Could implement rollback here in production
    }
  };

  // HANDLER: Start editing a booking
  const handleEditBooking = async (booking) => {
    try {
      // Fetch full booking details if we only have summary
      let fullBooking = booking;
      if (!booking.startTime && booking.bookingId) {
        fullBooking = await bookingService.getBookingById(booking.bookingId);
      }
      
      // Transform API data to match form expectations
      const formData = {
        id: fullBooking.bookingId || fullBooking.id,
        roomId: fullBooking.roomId,
        startTime: formatDateTimeForInput(fullBooking.startTime),
        endTime: formatDateTimeForInput(fullBooking.endTime),
        status: fullBooking.status || 'Pending'
      };
      
      setEditingBooking(formData);
      setShowBookingForm(true);
    } catch (err) {
      console.error('Failed to load booking details:', err);
      alert('Failed to load booking details');
    }
  };

  // Helper: Format DateTimeOffset for datetime-local input
  const formatDateTimeForInput = (dateTimeOffset) => {
    if (!dateTimeOffset) return '';
    // Convert to local datetime string format (YYYY-MM-DDTHH:mm)
    const date = new Date(dateTimeOffset);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // HANDLER: Create or update a room
  const handleRoomSubmit = async (roomData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      if (editingRoom) {
        // Update existing room
        const roomId = roomData.id;
        const updated = await roomService.updateRoom(roomId, roomData);
        setAllRooms(allRooms.map(r => 
          r.id === updated.id ? updated : r
        ));
        setShowRoomForm(false); // Close form first
        setEditingRoom(null); // Then clear editing state
        setToast({ show: true, message: 'Room updated successfully!', type: 'success' });
      } else {
        // Create new room
        const created = await roomService.createRoom(roomData);
        setAllRooms([...allRooms, created]);
        setShowRoomForm(false); // Close form first
        setToast({ show: true, message: 'Room created successfully!', type: 'success' });
      }
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
      
      setAllRooms(allRooms.filter(r => r.id !== roomId));
      setToast({ show: true, message: 'Room deleted successfully!', type: 'success' });
    } catch (err) {
      setError(err);
      console.error('Delete room failed:', err);
    }
  };

  // HANDLER: Start editing a room
  const handleEditRoom = (room) => {
    // Transform API data to match form expectations (lowercase properties)
    const formData = {
      id: room.id,
      name: room.name || room.Name,
      capacity: room.capacity || room.Capacity,
      location: room.location || room.Location,
      number: room.number || room.Number
    };
    
    setEditingRoom(formData);  
    setShowRoomForm(true);
  };
  
  // HANDLER: Cancel form (hide and reset editing state)
  const handleCancelBookingForm = () => {
    setShowBookingForm(false);
    setEditingBooking(null);
    setBookingFormErrors({});
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

  // HANDLER: Close toast notification
  const handleCloseToast = () => {
    setToast({ ...toast, show: false });
  };

  // HANDLER: Login
  const handleLogin = async (username, password) => {
    try {
      const result = await authService.login(username, password);
      setIsLoggedIn(true);
      setCurrentUser(result.user);
      setShowLoginForm(false);
      // Always bump refreshKey so the data-fetch effect fires even if
      // isLoggedIn was already true (stale token scenario after DB reset).
      setRefreshKey(k => k + 1);
      alert(`Welcome back, ${result.user.username}!`);
    } catch (error) {
      console.error('Login failed:', error);
      throw error; // Re-throw so LoginForm can show error
    }
  };

  // HANDLER: Logout
  const handleLogout = async () => {
    await authService.logout();
    setIsLoggedIn(false);
    setCurrentUser(null);
    alert('Logged out successfully');
  };

  // ==================== RENDER ====================

  // Show full-screen loader during initial data fetch
  if (isLoading) {
    return <LoadingSpinner overlay message="Loading dashboard..." />;
   } // Show error state if initial fetch failed and we have no data to display

  // Show error state if initial fetch failed
  if (error && allBookings.length === 0 && allRooms.length === 0) {
    return (
      <div className="app-container">
        <Header 
          isLoggedIn={isLoggedIn}
          currentUser={currentUser}
          onLogin={() => setShowLoginForm(true)}
          onLogout={handleLogout}
        />
        {showLoginForm && (
          <LoginForm 
            onLogin={handleLogin}
            onCancel={() => setShowLoginForm(false)}
          />
        )}
        <ErrorMessage 
          error={error}
          onRetry={handleRetry}
          onDismiss={handleDismissError}
        />
      </div>
     );
  }

  return (
    <div className="app-container">
      <Header 
        isLoggedIn={isLoggedIn}
        currentUser={currentUser}
        onLogin={() => setShowLoginForm(true)}
        onLogout={handleLogout}
      />

      {/* Login Form Modal */}
      {showLoginForm && (
        <LoginForm 
          onLogin={handleLogin}
          onCancel={() => setShowLoginForm(false)}
        />
      )}

      {/* Toast Notification - Shows on successful operations */}
      {toast.show && (
        <Toast 
          message={toast.message}
          type={toast.type}
          onClose={handleCloseToast}
        />
      )}

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
          <p className="stat-number">{filteredBookings.length}</p>
        </div>
        <div className="stat-card">
          <h3>Total Available Rooms</h3>
          <p className="stat-number">{filteredRooms.length}</p>
        </div>
      </div>

      {/* Cascading Filters - Demonstrates useEffect dependency array discipline */}
      <div className="filter-section">
        <div className="filter-group">
          <label htmlFor="category-filter">Filter by Category:</label>
          <select 
            id="category-filter"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="filter-select"
          >
            <option value="All">All Bookings</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Cancelled">Cancelled</option>
            <option value="By Location">Sorted by Location</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="location-filter">Filter by Location:</label>
          <select 
            id="location-filter"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="filter-select"
          >
            <option value="All">All Locations</option>
            {uniqueLocations.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
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
            rooms={allRooms}
            initialData={editingBooking}
            serverErrors={bookingFormErrors}
          />
        )}

        {/* Pass data AND handlers to child via props (Lifting State Up) */}
        <BookingList 
          bookings={filteredBookings}
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

        {/* Cascading Filters for Rooms */}
        <div className="filter-section">
          <div className="filter-group">
            <label htmlFor="room-capacity-filter">Filter by Capacity:</label>
            <select 
              id="room-capacity-filter"
              value={roomCapacityFilter}
              onChange={(e) => setRoomCapacityFilter(e.target.value)}
              className="filter-select"
            >
              <option value="All">All Capacities</option>
              <option value="Small">Small (&lt; 10)</option>
              <option value="Medium">Medium (10-15)</option>
              <option value="Large">Large (&gt; 15)</option>
              <option value="By Capacity">Sorted by Capacity</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="room-location-filter">Filter by Location:</label>
            <select 
              id="room-location-filter"
              value={roomLocationFilter}
              onChange={(e) => setRoomLocationFilter(e.target.value)}
              className="filter-select"
            >
              <option value="All">All Locations</option>
              {uniqueRoomLocations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>
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
          rooms={filteredRooms}
          onEdit={handleEditRoom}
          onDelete={handleDeleteRoom}
        />
      </section>

      {/* ── Stress Test Panel ─────────────────────────── */}
      <section className="section">
        <div className="section-header">
          <h2>Network Resilience</h2>
          <button
            className="btn btn-secondary"
            onClick={() => setShowStressTest((prev) => !prev)}
          >
            {showStressTest ? 'Hide Stress Test' : 'Show Stress Test'}
          </button>
        </div>
        {showStressTest && <NetworkStressTest />}
      </section>

      <Footer />
    </div>
  );
}

export default App;
