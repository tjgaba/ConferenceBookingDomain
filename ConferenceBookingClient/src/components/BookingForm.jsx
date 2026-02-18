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

import { useState } from "react";
import Button from "./Button";
import "./BookingForm.css";

function BookingForm({ onSubmit, onCancel, rooms, initialData = null }) {
  // State for each form field (Controlled Components pattern)
  // If initialData exists (editing mode), use it; otherwise use empty defaults
  const [roomId, setRoomId] = useState(initialData?.roomId || "");
  const [startTime, setStartTime] = useState(initialData?.startTime || "");
  const [endTime, setEndTime] = useState(initialData?.endTime || "");
  const [status, setStatus] = useState(initialData?.status || "Pending");

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
    
    // Create booking object
    const bookingData = {
      id: initialData?.id || Date.now(), // Use existing id or generate new one
      roomName: selectedRoom?.name || "Unknown",
      location: selectedRoom?.location || "Unknown",
      startTime,
      endTime,
      status
    };

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
