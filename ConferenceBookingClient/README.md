# Conference Booking Dashboard - React Frontend

This is a basic React + Vite frontend for the Conference Booking System.

## Tech Stack

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **ESLint** - Code linting

## Project Structure

```
ConferenceBookingClient/
├── index.html              # Entry HTML file
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
├── eslint.config.js        # ESLint configuration
└── src/
    ├── main.jsx            # React entry point
    ├── App.jsx             # Root component with static data
    └── components/
        ├── Header.jsx      # Dashboard header
        ├── Button.jsx      # Reusable button component
        ├── BookingList.jsx # List of bookings
        ├── BookingCard.jsx # Individual booking display
        ├── RoomList.jsx    # List of rooms
        └── RoomCard.jsx    # Individual room display
```

## Current Features

- ✅ Display static booking data
- ✅ Display static room data
- ✅ Component composition
- ✅ List rendering with `.map()` and keys
- ✅ Status-based styling for bookings
- ✅ Responsive grid layout for rooms
- ✅ Educational comments explaining React concepts

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Open browser to:
   ```
   http://localhost:5173
   ```

## Future Enhancements

This is a basic static version. Future additions will include:
- State management (useState, useReducer)
- API integration with the Conference Booking API
- Forms for creating bookings and rooms
- Authentication integration
- Real-time availability checking
- Filtering and sorting
- Routing (multiple pages)

## Learning Path

This project follows a progressive learning approach:
1. **Today**: Static data, component composition, props
2. **Tomorrow**: State management, event handlers
3. **Next**: API integration, useEffect, data fetching
4. **Later**: Forms, validation, authentication

## API Endpoints (Future Integration)

The backend API is available at `http://localhost:5000`:
- `GET /api/bookings` - List all bookings
- `GET /api/rooms` - List all rooms
- `POST /api/bookings` - Create a booking
- `GET /api/rooms/available` - Check room availability
