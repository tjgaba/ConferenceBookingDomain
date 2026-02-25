# Conference Booking Dashboard - React Frontend

A React + Vite frontend for the Conference Booking System. All HTTP communication is handled by a centralized, resilient Axios client that enforces JWT authentication, request/response interception, and race condition prevention across the entire application.

**Backend:** `http://localhost:5230/api`  
**Frontend:** `http://localhost:5173`

## Tech Stack

- **React 19** - UI library
- **Vite 7** - Build tool and dev server
- **Axios 1.13.5** - HTTP client (centralized singleton)
- **ESLint** - Code linting (`@eslint/js` + `react` + `react-hooks`)

## Environment Configuration

**`.env`** (required at project root):
```
VITE_API_BASE_URL=http://localhost:5230/api
```

This is the only place the backend URL is defined. Every request in the app inherits this base URL from the singleton.

## Project Structure

```
ConferenceBookingClient/
├── .env                      # Environment variables (VITE_API_BASE_URL)
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── App.css
│   ├── App.jsx               # Root component, NetworkStressTest toggle
│   ├── index.css
│   ├── main.jsx
│   ├── api/
│   │   └── apiClient.js      # ★ Axios singleton — the only HTTP instance in the app
│   ├── components/
│   │   ├── BookingCard.jsx
│   │   ├── BookingForm.jsx
│   │   ├── BookingList.jsx
│   │   ├── Button.jsx
│   │   ├── ErrorMessage.jsx
│   │   ├── Footer.jsx
│   │   ├── Header.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── NetworkStressTest.jsx  # ★ Resilience test panel (5 failure modes)
│   │   ├── NetworkStressTest.css
│   │   ├── RoomCard.jsx
│   │   ├── RoomForm.jsx
│   │   └── RoomList.jsx
│   ├── hooks/
│   │   └── useBookings.js    # ★ AbortController + four-path error discrimination
│   └── services/
│       ├── authService.js    # JWT login/logout — routes through apiClient
│       ├── bookingService.js # Booking CRUD — routes through apiClient
│       └── roomService.js    # Room CRUD — routes through apiClient
```

## Current Features

- ✅ Display booking data from live backend API (`GET /api/Booking`)
- ✅ Display room data from live backend API (`GET /api/Room`)
- ✅ Component composition
- ✅ List rendering with `.map()` and keys
- ✅ Status-based styling for bookings
- ✅ Responsive grid layout for rooms
- ✅ Interactive state management (add, update, delete bookings/rooms)
- ✅ Controlled form components
- ✅ JWT authentication with automatic token attachment on every request
- ✅ **Centralized Axios singleton (`src/api/apiClient.js`)**
- ✅ **Request interceptor: JWT injection + full-URL console logging**
- ✅ **Response interceptor: automatic `response.data` unwrap**
- ✅ **Async data fetching with `useEffect` + `useBookings` hook**
- ✅ **Three-state resilience pattern (`bookings` / `loading` / `error`)**
- ✅ **Four-path error discrimination (cancel / timeout / server / network)**
- ✅ **Race condition prevention with `AbortController`**
- ✅ **Memory safety with cleanup functions**
- ✅ **Network Stress Test panel (5 live failure-mode tests)**

## Resilient HTTP Client (Axios)

The entire frontend HTTP layer was rebuilt around a single, resilient Axios instance. No component or service creates its own Axios instance — all traffic flows through `src/api/apiClient.js`.

### Requirement 1: Singleton Instance

**File:** [`src/api/apiClient.js`](src/api/apiClient.js)

```javascript
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,  // http://localhost:5230/api
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' },
});

export default apiClient;
```

**Why a singleton?** Every ES module is cached after first import. Importing `apiClient` from any file always returns the same object — same interceptors, same config, no duplicate instances.

### Requirement 2: Interceptors

**Request interceptor** — runs before every request leaves the browser:

```javascript
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;

  const fullUrl = `${config.baseURL ?? ''}${config.url}`;
  console.log(`Sending ${config.method?.toUpperCase()} to ${fullUrl}`);

  return config;
});
```

- Reads JWT from `localStorage` under key `'token'`
- Attaches `Authorization: Bearer <token>` header automatically
- Logs the full URL (base + path) — `config.url` alone only has the path segment

**Response interceptor** — transforms every response before it reaches calling code:

```javascript
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.log(`Request failed: ${error.message}`);
    return Promise.reject(error);
  }
);
```

- Unwraps `response.data` once — callers receive data directly, not the Axios envelope
- Re-throws errors so `catch` blocks in hooks and services still fire
- Logs failed requests to the console

**Consequence for services:** Because the interceptor unwraps once, service functions must not chain `.data` again. See the [Service Layer](#service-layer) section.

### Requirement 3: `useBookings` Hook with Race Condition Prevention

**File:** [`src/hooks/useBookings.js`](src/hooks/useBookings.js)

```javascript
const [bookings, setBookings] = useState([]);
const [loading, setLoading]   = useState(false);
const [error, setError]       = useState(null);

useEffect(() => {
  const controller = new AbortController();
  setLoading(true);
  setError(null);

  (async () => {
    try {
      const { data: fetchedBookings } = await apiClient.get('/Booking', {
        params: { page: 1, pageSize: 100, sortBy: 'CreatedAt', sortOrder: 'desc' },
        signal: controller.signal,
      });
      setBookings(fetchedBookings ?? []);
    } catch (err) {
      if (axios.isCancel(err)) {
        return;                                               // component unmounted — silent
      } else if (err.code === 'ECONNABORTED') {
        setError('Request timed out. Please try again.');    // 5 s timeout hit
      } else if (err.response) {
        setError(`Server error ${err.response.status}: ${err.response.data?.message ?? 'Unknown'}`);
      } else {
        setError('Network error. Check your connection.');   // no response at all
      }
    } finally {
      setLoading(false);
    }
  })();

  return () => controller.abort();   // cleanup: cancel in-flight request on unmount
}, []);
```

**Why destructure `{ data: fetchedBookings }` instead of just using the response?**

The backend returns a pagination envelope:
```json
{ "data": [...], "totalCount": 142, "page": 1, "pageSize": 100 }
```

The response interceptor unwraps the Axios wrapper → we receive the envelope. The destructure then pulls the inner `data` array — no double-`.data` chain, no confusion.

**Four error paths:**

| Condition | Cause | Message shown |
|---|---|---|
| `axios.isCancel(err)` | Component unmounted mid-request | Silent — no state update |
| `err.code === 'ECONNABORTED'` | 5 s timeout exceeded | "Request timed out…" |
| `err.response` exists | Backend returned 4xx/5xx | "Server error {status}…" |
| else | DNS failure, refused connection | "Network error…" |

### Requirement 4: Network Stress Test

**File:** [`src/components/NetworkStressTest.jsx`](src/components/NetworkStressTest.jsx)

A self-contained panel reachable via the "Network Resilience" toggle in `App.jsx`. All five tests make **real HTTP requests** — no mocks.

| Test | How it breaks | What you expect to see |
|---|---|---|
| **Timeout** | Overrides `timeout: 1` ms | ECONNABORTED → "Request timed out" |
| **Network Error** | Targets port 19999 (nothing listening) | ERR_CONNECTION_REFUSED → "Network error" |
| **401 Unauthorized** | Sends `Authorization: Bearer invalid_token` | 401 → "Server error 401" |
| **404 Not Found** | `GET /Booking/2147483647` (impossible ID) | 404 → "Server error 404" |
| **Cancel** | `controller.abort()` called synchronously before request resolves | Cancelled → silent |

`abortRef` cancels any previous test before starting a new one — preventing stale result overlap.

---

## Service Layer

All three services import `apiClient` and route every call through it. **No service creates its own Axios instance.**

```javascript
// bookingService.js, roomService.js, authService.js — all start with:
import apiClient from '../api/apiClient';
```

Because the response interceptor already does `response.data`, services must **not** chain `.data` again. The pattern is:

```javascript
// ✅ Correct — interceptor already unwrapped once
export const fetchAllBookings = async () => {
  const response = await apiClient.get('/Booking', { params: { page: 1, pageSize: 100 } });
  return response.data || [];   // response IS the pagination envelope; .data is inner array
};

// ❌ Wrong — double unwrap
const response = await apiClient.get('/Booking');
return response.data.data;     // Never do this
```

`authService.js` follows the same rule — login response fields are accessed directly:

```javascript
const response = await apiClient.post('/Auth/login', credentials);
localStorage.setItem('token', response.token);   // response.token, not response.data.token
```

---

## Async Patterns & Lifecycle

### Three-State Pattern

Every async resource in the app uses three parallel state variables:

```javascript
const [bookings, setBookings] = useState([]);   // the data
const [loading, setLoading]   = useState(false); // in-flight indicator
const [error, setError]       = useState(null);  // failure message
```

**State transitions:**
1. Mount → `loading: true, error: null`
2. Success → `loading: false, data: [...]`
3. Failure → `loading: false, error: "message"`

### AbortController & Cleanup

`useBookings` creates a new `AbortController` per effect invocation and passes `signal` to Axios. The cleanup function (`return () => controller.abort()`) fires when:
- The component unmounts (user navigates away)
- The effect re-runs (effect dependencies change)

This guarantees no stale responses ever update state.

### Dependency Array Discipline

The `useEffect` in `useBookings` uses an empty dependency array (`[]`) — the fetch runs once on mount. Adding the wrong dependency would cause an infinite loop:

```javascript
// ❌ Infinite loop
useEffect(() => {
  fetchBookings().then(data => setBookings(data));
}, [bookings]);  // depends on what we're setting!

// ✅ Correct — runs once
useEffect(() => {
  fetchBookings().then(data => setBookings(data));
}, []);
```

**Rule:** Never include a state variable in the dependency array if the same effect calls its setter.

---

## Error Handling

**User-facing errors:** [`src/components/ErrorMessage.jsx`](src/components/ErrorMessage.jsx)

| Error level | When | UI |
|---|---|---|
| Critical | Initial load fails | Full-screen error with Retry button |
| Non-critical | Operation fails (create/update/delete) | Banner, keeps existing data |

**Recovery options:**
- **Retry** — reloads the page to re-trigger the fetch
- **Dismiss** — hides the banner
- **Optimistic updates** — UI reflects changes immediately; rolls back on error

---

## State Management

### Lifting State Up

`useState` lives at two levels:

| Level | Where | What |
|---|---|---|
| **Local (form)** | `BookingForm.jsx`, `RoomForm.jsx` | Temporary typed input; discarded on submit |
| **Global (app)** | `App.jsx` | Persisted bookings/rooms; shared across siblings |

Form components do not couple to parent state structure. They call `onSubmit(data)` and the parent decides what to do with it.

### Unidirectional Data Flow

```
App state (bookings, rooms)
   ↓ props
 BookingList / RoomList / Forms
   ↑ callbacks (onSubmit, onDelete)
App state updates → re-render
```

---

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment** — create `.env` at the project root:
   ```
   VITE_API_BASE_URL=http://localhost:5230/api
   ```

3. **Start the backend** (from solution root):
   ```bash
   dotnet run --project API/API.csproj
   ```

4. **Start the frontend:**
   ```bash
   npm run dev
   ```

5. **Open browser:**
   ```
   http://localhost:5173
   ```

6. **(Optional) Open the Network Stress Test** by clicking the "Network Resilience" toggle at the bottom of the page to verify all five failure-mode paths.

---

## API Endpoints Used

Backend runs at `http://localhost:5230/api`. The frontend uses the following endpoints:

| Method | Path | Description |
|---|---|---|
| `POST` | `/Auth/login` | Obtain JWT token |
| `GET` | `/Booking` | Paginated booking list |
| `POST` | `/Booking` | Create a booking |
| `PUT` | `/Booking/{id}` | Update a booking |
| `DELETE` | `/Booking/{id}` | Delete a booking |
| `GET` | `/Room` | Paginated room list |
| `POST` | `/Room` | Create a room |
| `PUT` | `/Room/{id}` | Update a room |
| `DELETE` | `/Room/{id}` | Delete a room |

All requests carry `Authorization: Bearer <token>` (attached automatically by the request interceptor).

