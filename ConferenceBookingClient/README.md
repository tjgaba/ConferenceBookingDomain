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
│   │   ├── ErrorMessage.jsx  # Error display with retry
│   │   ├── Footer.jsx        # Footer component
│   │   ├── Header.jsx        # Dashboard header
│   │   ├── LoadingSpinner.jsx # Loading state indicator
│   │   ├── RoomCard.jsx      # Individual room display
│   │   ├── RoomForm.jsx      # Create/edit room form
│   │   └── RoomList.jsx      # List of rooms
│   ├── Data/
│   │   ├── localStorage.js   # Browser storage utilities
│   │   └── mockData.js       # Initial data for bookings/rooms
│   └── services/
│       ├── bookingService.js # Async booking API with fetchAllBookings()
│       └── roomService.js    # Async room API with fetchAllRooms()
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
- ✅ **Async data fetching with useEffect**
- ✅ **Component lifecycle management (mount, update, unmount)**
- ✅ **Resilient state pattern (data + loading + error)**
- ✅ **Network latency and failure simulation**
- ✅ **Memory safety with cleanup functions**
- ✅ **Race condition prevention with AbortController**

## Asynchronous Operations & Component Lifecycle

This application demonstrates **production-ready async state management** with proper error handling, loading states, and memory safety.

### Network Simulation

**API Services:** [`src/services/bookingService.js`](src/services/bookingService.js) & [`src/services/roomService.js`](src/services/roomService.js)

The app simulates real-world API behavior:
- **Random Latency**: 500-2500ms delay per operation (using `setTimeout`)
- **Random Failures**: 20% chance of network/server errors (promise rejection)
- **Async/Await**: All operations return Promises
- **Console Logging**: See API calls in browser DevTools

**Key Function:** `fetchAllBookings()` returns a Promise that:
- Resolves after random delay (500-2500ms) 
- Rejects 20% of the time with random error messages
- Simulates "flaky API" conditions for robust error handling

This simulates what would happen with actual `fetch()` calls to a backend server.

### Resilient State Pattern

**Implementation:** [App.jsx](src/App.jsx#L40-L56)

Instead of just storing data, each resource maintains:
```javascript
// Data state
const [bookings, setBookings] = useState([]);
const [rooms, setRooms] = useState([]);

// Loading states
const [isLoading, setIsLoading] = useState(true);
const [isSubmitting, setIsSubmitting] = useState(false);

// Error state
const [error, setError] = useState(null);
```

**State Transitions:**
1. **Initial**: `{ data: [], loading: true, error: null }`
2. **Success**: `{ data: [...], loading: false, error: null }`
3. **Failure**: `{ data: [], loading: false, error: Error }`

### Component Lifecycle with useEffect

**Initial Data Fetch:** [App.jsx](src/App.jsx#L61-L92)

```javascript
useEffect(() => {
  const abortController = new AbortController();
  let isMounted = true;

  const fetchInitialData = async () => {
    try {
      setIsLoading(true);
      const [bookingsData, roomsData] = await Promise.all([
        api.fetchBookings(),
        api.fetchRooms()
      ]);
      
      if (isMounted && !abortController.signal.aborted) {
        setBookings(bookingsData);
        setRooms(roomsData);
      }
    } catch (err) {
      if (isMounted) setError(err);
    } finally {
      if (isMounted) setIsLoading(false);
    }
  };

  fetchInitialData();

  // Cleanup function prevents memory leaks
  return () => {
    isMounted = false;
    abortController.abort();
  };
}, []); // Empty array = run once on mount
```

**Key Patterns:**

1. **AbortController** - Cancels fetch if component unmounts
2. **isMounted Flag** - Prevents state updates after unmount  
3. **Cleanup Function** - Runs when component unmounts, stops background processes
4. **Empty Dependency Array** - Effect runs only once (on mount)
5. **Promise.all** - Parallel fetching for better performance

### Memory Safety & Cleanup

**Why Cleanup Matters:**

Without cleanup, if the component unmounts while an async operation is in progress:
- ❌ "Can't perform state update on unmounted component" warning
- ❌ Memory leak (operation continues in background)
- ❌ Race conditions (late responses overwrite newer data)

**With Cleanup:**
```javascript
return () => {
  isMounted = false;          // Prevent state updates
  abortController.abort();     // Cancel pending requests
};
```

✅ Operations stop immediately on unmount  
✅ No memory leaks  
✅ No React warnings

### Error Handling

**User-Facing Errors:** [ErrorMessage.jsx](src/components/ErrorMessage.jsx)

Errors can occur at two levels:

1. **Critical (Initial Load Failure)** - Shows full-screen error with retry
2. **Non-Critical (Operation Failure)** - Shows banner, keeps existing data

**Error Recovery:**
- **Retry Button** - Reloads the page to refetch
- **Dismiss Button** - Hides error banner
- **Optimistic Updates** - UI updates immediately, rolls back on error

### Loading States

**User Feedback Components:**

1. **LoadingSpinner (Overlay)** - [App.jsx](src/App.jsx#L206) - Full-screen during submit operations
2. **LoadingSpinner (Inline)** - [App.jsx](src/App.jsx#L191) - Within content during initial load

**UX Pattern:**
- Initial load → Full-screen spinner
- Submit/Delete → Overlay spinner with disabled buttons
- Background operations → Silent (no UI blocking)

## Data Persistence

This application uses the browser's **localStorage** API to persist bookings and rooms data across page refreshes.

### Implementation

**Storage Utilities:** [`src/Data/localStorage.js`](src/Data/localStorage.js)  
**API Services:** [`src/services/bookingService.js`](src/services/bookingService.js) & [`src/services/roomService.js`](src/services/roomService.js)

- `loadBookings()` / `saveBookings()` - Synchronous localStorage operations
- `fetchAllBookings()` / `createBooking()` / `updateBooking()` / `deleteBooking()` - Async API calls
- Similar pattern for rooms: `fetchAllRooms()`, `createRoom()`, etc.

**Data Flow:**
1. **Mount** - `bookingService.fetchAllBookings()` → Async delay → `loadBookings()` from localStorage
2. **Create** - `bookingService.createBooking()` → Async delay → `saveBookings()` to localStorage
3. **Update/Delete** - Same async → sync pattern

Data persists via localStorage but **all access is async** to simulate real API behavior.

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
