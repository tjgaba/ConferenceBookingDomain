# Conference Booking Dashboard - React Frontend

This is a basic React + Vite frontend for the Conference Booking System.

## Tech Stack

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **ESLint** - Code linting

## Project Structure

```
ConferenceBookingClient/
├── .gitignore                # Git ignore rules
├── eslint.config.js          # ESLint configuration
├── index.html                # Entry HTML file
├── package.json              # Dependencies and scripts
├── package-lock.json         # Lockfile
├── README.md                 # Project documentation
├── vite.config.js            # Vite configuration
├── src/
│   ├── App.css               # App-level styles
│   ├── App.jsx               # Root component
│   ├── index.css             # Global styles
│   ├── main.jsx              # React entry point
│   ├── mockData.js           # Static mock data
│   └── components/
│       ├── BookingCard.css   # BookingCard styles
│       ├── BookingCard.jsx   # Individual booking display
│       ├── BookingList.css   # BookingList styles
│       ├── BookingList.jsx   # List of bookings
│       ├── Button.css        # Button styles
│       ├── Button.jsx        # Reusable button component
│       ├── Footer.css        # Footer styles
│       ├── Footer.jsx        # Footer component
│       ├── Header.css        # Header styles
│       ├── Header.jsx        # Dashboard header
│       ├── RoomCard.css      # RoomCard styles
│       ├── RoomCard.jsx      # Individual room display
│       ├── RoomList.css      # RoomList styles
│       ├── RoomList.jsx      # List of rooms
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
