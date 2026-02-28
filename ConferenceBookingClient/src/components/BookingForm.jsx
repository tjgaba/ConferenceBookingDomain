// BookingForm.jsx — A controlled form component for creating/editing bookings.
//
// CONTROLLED COMPONENTS:
//   - Form inputs whose values are controlled by React state
//   - Every keystroke updates state via onChange handlers
//   - The state is the "single source of truth" for the input value
//   - This allows React to validate, transform, or react to input changes in real-time
//
// STATE MANAGEMENT:
//   - useState hook creates a state variable and a setter function
//   - State persists across re-renders (unlike regular variables)
//   - When state changes, React re-renders the component
//
// LIFTING STATE UP:
//   - This form doesn't store the bookings array
//   - It only manages its own form fields
//   - The parent (App) manages the actual bookings data
//   - When submitted, it calls onSubmit (passed from parent) to update parent's state

import { useState, useEffect } from "react";
import Button from "./Button";
import "./BookingForm.css";

function BookingForm({ onSubmit, onCancel, rooms, initialData = null, serverErrors = {} }) {
  // State for each form field (Controlled Components pattern)
  // If initialData exists (editing mode), use it; otherwise use empty defaults
  const [roomId, setRoomId] = useState(initialData?.roomId || "");
  const [startTime, setStartTime] = useState(initialData?.startTime || "");
  const [endTime, setEndTime] = useState(initialData?.endTime || "");
  const [status, setStatus] = useState(initialData?.status || "Pending");

  // Update form fields when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData) {
      setRoomId(initialData.roomId || "");
      setStartTime(initialData.startTime || "");
      setEndTime(initialData.endTime || "");
      setStatus(initialData.status || "Pending");
    } else {
      // Reset form when creating new booking
      setRoomId("");
      setStartTime("");
      setEndTime("");
      setStatus("Pending");
    }
  }, [initialData]);

  // Helper function to format datetime for API with proper timezone handling
  // The backend validates business hours (08:00-16:00) using the HOUR component
  // We need to ensure the hour sent matches what the user selected
  const formatDateTimeForAPI = (dateTimeString) => {
    // dateTimeString is from datetime-local input: "2026-02-24T09:03"
    // Create a Date object but interpret the input as local time
    const date = new Date(dateTimeString);
    
    // Format as ISO string with local timezone offset (e.g., "2026-02-24T09:03:00+02:00")
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = '00';
    
    // Get timezone offset in format +HH:MM or -HH:MM
    const timezoneOffset = -date.getTimezoneOffset(); // Invert because getTimezoneOffset returns opposite sign
    const offsetHours = String(Math.floor(Math.abs(timezoneOffset) / 60)).padStart(2, '0');
    const offsetMinutes = String(Math.abs(timezoneOffset) % 60).padStart(2, '0');
    const offsetSign = timezoneOffset >= 0 ? '+' : '-';
    
    // Return ISO 8601 format with timezone: "2026-02-24T09:03:00+02:00"
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${offsetSign}${offsetHours}:${offsetMinutes}`;
  };

  // Event Handler: Called when form is submitted
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevents page reload (default HTML form behavior)
    
    // Validation
    if (!roomId || !startTime || !endTime) {
      alert("Please fill in all fields");
      return;
    }

    // Find the selected room to get its details
    const selectedRoom = rooms.find(r => r.id === parseInt(roomId));
    
    if (!selectedRoom) {
      alert("Invalid room selected");
      return;
    }

    let bookingData;
    
    if (initialData) {
      // UPDATE: Match UpdateBookingDTO structure
      bookingData = {
        bookingId: initialData.id,
        roomId: parseInt(roomId),
        startTime: formatDateTimeForAPI(startTime),
        endTime: formatDateTimeForAPI(endTime),
        status: status
      };
    } else {
      // CREATE: Match CreateBookingRequestDTO structure
      bookingData = {
        roomId: parseInt(roomId),
        startDate: formatDateTimeForAPI(startTime),
        endDate: formatDateTimeForAPI(endTime),
        location: selectedRoom.location,
        capacity: selectedRoom.capacity
      };
      
      console.log('Creating booking with data:', bookingData);
      console.log('Selected room:', selectedRoom);
    }

    // Call parent's onSubmit handler (lifting state up)
    onSubmit(bookingData); //Form's onSubmit Handler Calls Prop-Function 
    
    // Reset form fields
    setRoomId("");
    setStartTime("");
    setEndTime("");
    setStatus("Pending");
  };

  // Event Handler: Clear all form fields
  const handleClear = () => {
    setRoomId("");
    setStartTime("");
    setEndTime("");
    setStatus("Pending");
  };

  return (
    <div className="booking-form-container">
      <h3>{initialData ? "Edit Booking" : "Create New Booking"}</h3>

      {/* Req 5: General server error (e.g. "Room is already occupied") */}
      {serverErrors.general && (
        <p style={{ color: '#dc3545', background: '#f8d7da', border: '1px solid #f5c6cb', borderRadius: '4px', padding: '8px 12px', marginBottom: '12px', fontSize: '0.875rem' }}>
          {serverErrors.general}
        </p>
      )}

      <form className="booking-form" onSubmit={handleSubmit}>
        
        {/* Controlled Select Input */}
        <div className="form-group">
          <label htmlFor="room">Room:</label>
          <select
            id="room"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            required
          >
            <option value="">Select a room...</option>
            {rooms.map(room => (
              <option key={room.id} value={room.id}>
                {room.name} - {room.location} (Capacity: {room.capacity})
              </option>
            ))}
          </select>
          {/* Req 5: Per-field server error */}
          {serverErrors.roomId && (
            <span style={{ color: '#dc3545', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>
              {serverErrors.roomId}
            </span>
          )}
        </div>

        {/* Controlled DateTime Input */}
        <div className="form-group">
          <label htmlFor="startTime">Start Time:</label>
          <input
            type="datetime-local"
            id="startTime"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
          {/* Req 5: Per-field server error */}
          {serverErrors.startTime && (
            <span style={{ color: '#dc3545', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>
              {serverErrors.startTime}
            </span>
          )}
        </div>

        {/* Controlled DateTime Input */}
        <div className="form-group">
          <label htmlFor="endTime">End Time:</label>
          <input
            type="datetime-local"
            id="endTime"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
          {/* Req 5: Per-field server error */}
          {serverErrors.endTime && (
            <span style={{ color: '#dc3545', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>
              {serverErrors.endTime}
            </span>
          )}
        </div>

        {/* Controlled Select Input */}
        <div className="form-group">
          <label htmlFor="status">Status:</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <Button 
            label={initialData ? "Update" : "Create"} 
            variant="success"
            type="submit"
          />
          <Button 
            label="Clear" 
            variant="secondary"
            onClick={handleClear}
            type="button"
          />
          <Button 
            label="Cancel" 
            variant="secondary"
            onClick={onCancel}
            type="button"
          />
        </div>
      </form>
    </div>
  );
}

export default BookingForm;
