// RoomForm.jsx — A controlled form component for creating/editing rooms.
//
// This component demonstrates the same patterns as BookingForm:
//   - Controlled Components: All inputs are controlled by React state
//   - Event Handlers: onChange updates state, onSubmit processes the form
//   - Lifting State Up: Calls parent's handler to update the rooms array
//
// Each input field has:
//   1. A state variable (e.g., name)
//   2. A value prop bound to that state (value={name})
//   3. An onChange handler that updates state (onChange={(e) => setName(e.target.value)})

import { useState, useEffect } from "react";
import Button from "./Button";
import "./RoomForm.css";

function RoomForm({ onSubmit, onCancel, initialData = null }) {
  // State for each form field
  const [name, setName] = useState(initialData?.name || "");
  const [capacity, setCapacity] = useState(initialData?.capacity || "");
  const [location, setLocation] = useState(initialData?.location || "");
  const [number, setNumber] = useState(initialData?.number || "");

  // Update form fields when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setCapacity(initialData.capacity || "");
      setLocation(initialData.location || "");
      setNumber(initialData.number || "");
    } else {
      // Reset form when creating new room
      setName("");
      setCapacity("");
      setLocation("");
      setNumber("");
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!name || !capacity || !location || !number) {
      alert("Please fill in all fields");
      return;
    }

    if (capacity <= 0 || number <= 0) {
      alert("Capacity and number must be positive");
      return;
    }

    // Create room object
    const roomData = {
      id: initialData?.id || Date.now(),
      name,
      capacity: parseInt(capacity),
      location,
      number: parseInt(number)
    };

    // Lift state up: Call parent's handler
    onSubmit(roomData);
    
    // Reset form
    setName("");
    setCapacity("");
    setLocation("");
    setNumber("");
  };

  // Event Handler: Clear all form fields
  const handleClear = () => {
    setName("");
    setCapacity("");
    setLocation("");
    setNumber("");
  };

  return (
    <div className="room-form-container">
      <h3>{initialData ? "Edit Room" : "Add New Room"}</h3>
      <form className="room-form" onSubmit={handleSubmit}>
        
        {/* Controlled Text Input */}
        <div className="form-group">
          <label htmlFor="name">Room Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Room A"
            required
          />
        </div>

        {/* Controlled Number Input */}
        <div className="form-group">
          <label htmlFor="capacity">Capacity:</label>
          <input
            type="number"
            id="capacity"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            min="1"
            placeholder="e.g., 10"
            required
          />
        </div>

        {/* Controlled Text Input */}
        <div className="form-group">
          <label htmlFor="location">Location:</label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., London"
            required
          />
        </div>

        {/* Controlled Number Input */}
        <div className="form-group">
          <label htmlFor="number">Room Number:</label>
          <input
            type="number"
            id="number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            min="1"
            placeholder="e.g., 101"
            required
          />
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <Button 
            label={initialData ? "Update" : "Add Room"} 
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

export default RoomForm;
