// mockData.js — Mock data for the Conference Booking application.
// This simulates what will later come from the backend API.
// Each booking object has a unique "id" — this is critical for React's key prop when rendering lists.

export const bookings = [
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
  { 
    id: 4, 
    roomName: "Room B", 
    location: "Bloemfontein",
    startTime: "2026-03-18 13:00:00", 
    endTime: "2026-03-18 15:00:00",
    status: "Cancelled" 
  },
  { 
    id: 5, 
    roomName: "Room E", 
    location: "Durban",
    startTime: "2026-03-19 08:00:00", 
    endTime: "2026-03-19 10:00:00",
    status: "Confirmed" 
  },
];

export const rooms = [
  { id: 1, name: "Room A", capacity: 10, location: "London", number: 101 },
  { id: 2, name: "Room B", capacity: 8, location: "London", number: 102 },
  { id: 3, name: "Room C", capacity: 15, location: "Cape Town", number: 201 },
  { id: 4, name: "Room D", capacity: 20, location: "Johannesburg", number: 301 },
];

// Mock current user — simulates a logged-in user
// In a real app, this would come from authentication context/state
export const currentUser = {
  id: 1,
  name: "John Smith",
  email: "john.smith@company.com",
  role: "Admin"
};
