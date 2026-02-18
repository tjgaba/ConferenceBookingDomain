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
│   ├── components/           # Reusable UI components
│   │   ├── BookingCard.jsx   # Individual booking display
│   │   ├── BookingForm.jsx   # Create/edit booking form
│   │   ├── BookingList.jsx   # List of bookings
│   │   ├── Button.jsx        # Reusable button component
│   │   ├── Footer.jsx        # Footer component
│   │   ├── Header.jsx        # Dashboard header
│   │   ├── RoomCard.jsx      # Individual room display
│   │   ├── RoomForm.jsx      # Create/edit room form
│   │   └── RoomList.jsx      # List of rooms
│   └── Data/
│       ├── mockData.js       # Initial data for bookings/rooms
│       └── localStorage.js   # Browser storage utilities
```

## Current Features

- ✅ Display static booking data
- ✅ Display static room data
- ✅ Component composition
- ✅ List rendering with `.map()` and keys
- ✅ Status-based styling for bookings
- ✅ Responsive grid layout for rooms
- ✅ Educational comments explaining React concepts
- ✅ Interactive state management (add, update, delete bookings/rooms)
- ✅ Controlled form components
- ✅ Data persistence with localStorage (survives page refresh)

## Data Persistence

This application uses the browser's **localStorage** API to persist bookings and rooms data across page refreshes.

### Implementation

**Storage Utilities:** [`src/Data/localStorage.js`](src/Data/localStorage.js)
- `loadBookings()` - Retrieves bookings from localStorage
- `saveBookings()` - Saves bookings to localStorage
- `loadRooms()` - Retrieves rooms from localStorage
- `saveRooms()` - Saves rooms to localStorage
- `clearStorage()` - Clears all persisted data

**How It Works:**
1. **On App Mount** - Data loads from localStorage using lazy initialization: `useState(() => loadBookings(initialBookings))`
2. **On Data Change** - `useEffect` automatically saves to localStorage whenever bookings or rooms arrays change
3. **JSON Format** - Data is serialized with `JSON.stringify()` and deserialized with `JSON.parse()`
4. **Fallback** - If localStorage is empty (first visit), falls back to mockData

This means all bookings and rooms you create persist even after closing the browser. To reset data, clear your browser's localStorage or use the `clearStorage()` utility.

## State Management: Lifting State Up

This app uses `useState` at different component levels following React's "Lifting State Up" pattern.

### Why useState in Form vs App Components?

**Form Components use useState for:**
- **Temporary input state** - Tracks what the user is actively typing before submission. This state is ephemeral and discarded after form submission or cancellation.
- **Performance isolation** - Input changes only trigger re-renders of the form component, not the entire application tree.
- **Component reusability** - Forms remain self-contained and can be used in different contexts without coupling to parent state structure.

**App Component uses useState for:**
- **Persistent application data** - Maintains the single source of truth for bookings and rooms that must be shared across multiple components.
- **Cross-component communication** - Enables sibling components (BookingList, RoomList, BookingForm, RoomForm) to access and modify the same data through props and callbacks.
- **UI state management** - Controls visibility and editing modes that affect multiple parts of the application simultaneously.

This architectural choice follows React's principle of placing state at the lowest common ancestor that needs to access it, ensuring optimal performance while maintaining data accessibility.

### Implementation Details

**Form State (Local)** - Lives in BookingForm.jsx and RoomForm.jsx
- Manages temporary input values (what user is typing)
- Updates on every keystroke for controlled components
- Cleared when form is submitted or cancelled
- Only the form re-renders during typing (performance optimization)

```javascript
// BookingForm.jsx - Lines 27-30
const [roomId, setRoomId] = useState("");
const [startTime, setStartTime] = useState("");
const [endTime, setEndTime] = useState("");
const [status, setStatus] = useState("Pending");
```

**App State (Global)** - Lives in App.jsx
- Manages persistent data (bookings, rooms)
- Shared between sibling components via props
- Single source of truth for the entire application
- UI state (show/hide forms, editing mode)

```javascript
// App.jsx - Lines 35-45
const [bookings, setBookings] = useState(initialBookings);
const [rooms, setRooms] = useState(initialRooms);
const [showBookingForm, setShowBookingForm] = useState(false);
const [editingBooking, setEditingBooking] = useState(null);
```

### Data Flow

1. User types in form → Updates local form state → Only form re-renders
2. User clicks Submit → Form calls `onSubmit(data)` → Passes data to App
3. App updates global state → All dependent components re-render with new data

This separation ensures forms don't trigger full app re-renders on every keystroke, maintaining good performance.

## Design Principles Applied

### 1. Separation of Concerns
- Forms handle temporary input capture
- App handles persistent data management
- Components focus on their specific responsibility

### 2. Single Source of Truth
- One place for bookings data (App)
- No duplicate or conflicting state
- Clear ownership of each piece of state

### 3. Unidirectional Data Flow
- Data flows down via props
- Events flow up via callbacks
- Predictable and debuggable

### 4. Component Reusability
- Forms don't depend on specific parent
- Can be reused with different data sources
- Testable in isolation

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
