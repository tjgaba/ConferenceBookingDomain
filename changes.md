# Changes — The Secure Real-Time Handshake (Mutations & Auth)

## Overview
This document summarises every change made to the Conference Room Booking System during this session. The goal was to transition the application from a read-only state into a secure, authenticated system capable of persistent data mutations, server-side validation, and real-time state synchronisation.

---

## 1. Axios POST & PUT — Command Handshake

### What Changed
`useBookings.js` was upgraded from a read-only fetch hook into a full command hook that handles create, update, and re-fetch.

### How It Was Implemented

**`src/hooks/useBookings.js`**

Two new functions were added alongside a shared `refetch()` utility:

```javascript
// Req 1: POST — create a new booking
const createBooking = useCallback(async (bookingData) => {               // Line: 110
  const payload = { roomId, startDate, endDate, location, capacity };    // Req 2: DTO shape
  const created = await apiClient.post('/Booking', payload);
  await refetch();                                                        // Req 3: Pessimistic Update — Line: 124
  return created;
}, [refetch]);

// Req 1: PUT — update an existing booking
const updateBooking = useCallback(async (bookingId, bookingData) => {    // Line: 149
  const payload = { bookingId, roomId?, startTime?, endTime?, status? }; // Req 2: DTO shape
  const updated = await apiClient.put(`/Booking/${bookingId}`, payload);
  await refetch();                                                        // Req 3: Pessimistic Update
  return updated;
}, [refetch]);
```

- **Payload contract (Req 2)**: Each function builds an explicit object that matches the .NET `[FromBody]` DTO exactly — `CreateBookingRequestDTO` for POST and `UpdateBookingDTO` for PUT.
- **Pessimistic Update (Req 3)**: `refetch()` is called after every successful mutation so the list reflects confirmed server state.
- A separate `mutating` boolean was introduced so the UI can disable buttons during POST/PUT without conflating it with the initial `loading` state.

---

## 2. Server-Side Validation — Validation Handshake

### What Changed
The backend was upgraded from returning a plain `{ message: "..." }` object to returning a proper `ValidationProblemDetails` with field-keyed errors. The validation service now carries a `fieldName` alongside each error message.

### How It Was Implemented

**`API/Services/BookingValidationService.cs`**

Return types of `ValidateBookingCreationAsync` and `ValidateBookingUpdateAsync` were upgraded to include a `fieldName`:

```csharp
// Before
public async Task<(bool isValid, string? errorMessage, ConferenceRoom? room)>

// After
public async Task<(bool isValid, string? errorMessage, string? fieldName, ConferenceRoom? room)>
// ValidateBookingCreationAsync — Line: 161
// ValidateBookingUpdateAsync  — Line: 209
// ValidateBusinessHours       — Line: 66
```

Each rule failure now specifies which field caused it — `"RoomId"`, `"StartDate"`, `"EndDate"`, `"StartTime"`, `"EndTime"`, or `"Capacity"`. `ValidateBusinessHours` was similarly upgraded to return a `fieldName`.

**`API/Controllers/BookingController.cs`**

`CreateBooking` and `UpdateBooking` now build a `ValidationProblemDetails` using that `fieldName`:

```csharp
var problem = new ValidationProblemDetails();                       // Line: 293
problem.Errors[validation.fieldName ?? "General"] = new[] { validation.errorMessage! }; // Line: 295
return BadRequest(problem);
```

This produces the standard RFC 7807 shape:
```json
{
  "title": "One or more validation errors occurred.",
  "status": 400,
  "errors": { "StartDate": ["Booking start time must be between 08:00 and 16:00."] }
}
```

**`src/App.jsx` — Axios catch block**

The catch block in `handleBookingSubmit` reads `err.response.data.errors`, maps every field key to the corresponding React form field, and falls back to `data.message` / `data.title` for non-field errors:

```javascript
const e = data.errors;
if (e.RoomId)    mapped.roomId    = e.RoomId[0];    // Line: 333
if (e.StartDate) mapped.startTime = e.StartDate[0]; // Line: 334
if (e.EndDate)   mapped.endTime   = e.EndDate[0];   // Line: 335
// ... PUT field names (StartTime, EndTime) also covered — Lines: 337-338
```

**`src/components/BookingForm.jsx`**

Each input now accepts a `serverErrors` prop and renders a message directly beneath the field:

```jsx
{serverErrors.startTime && (
  <span style={{ color: '#dc3545', fontSize: '0.8rem', display: 'block' }}>
    {serverErrors.startTime}
  </span>
)}
```

A general banner at the top handles non-field errors (`serverErrors.general`).

---

## 3. Authentication Integration — JWT Flow

### What Changed
`LoginForm`, the Axios Request Interceptor, and the 401 Response Interceptor were verified as already present. The 401 redirect path was completed: the interceptor now dispatches a `CustomEvent` that the new `useAuth` hook listens for globally.

### How It Was Implemented

**`src/api/apiClient.js` — Request Interceptor**

Reads the JWT from `localStorage` and attaches it automatically:
```javascript
apiClient.interceptors.request.use((config) => {                   // Line: 24
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

**`src/api/apiClient.js` — Response Interceptor (401 path)**

On a 401 response, clears all auth keys and fires a `CustomEvent` to decouple the interceptor from React state:
```javascript
if (error.response?.status === 401) {             // Line: 44
  localStorage.removeItem('token');               // Line: 45
  localStorage.removeItem('refreshToken');        // Line: 46
  localStorage.removeItem('user');                // Line: 47
  window.dispatchEvent(new CustomEvent('auth:unauthorized')); // Line: 50
}
```

**`src/services/authService.js`**

`login()` posts credentials to `/auth/login` via `apiClient` and stores the returned JWT:
```javascript
async login(username, password) {                              // Line: 11
  const response = await apiClient.post('/auth/login', { username, password }); // Line: 12
  if (response.token) localStorage.setItem('token', response.token); // Line: 19
  return response;
}
```

---

## 4. Required Business Rules

### What Changed
The State Control rule was not enforced — `ApplyStatusChange` was bypassing the domain entity's `Confirm()` and `Cancel()` methods by directly assigning `booking.Status = newStatus`. The other two rules (Fail-Fast, Room Integrity) were already in place.

### How It Was Implemented

**`API/Models/Booking.cs`**

`Confirm()` was given descriptive error messages for every illegal path:
```csharp
public void Confirm()                                                           // Line: 60
{
    if (Status == BookingStatus.Confirmed)
        throw new InvalidOperationException("Booking is already confirmed.");   // Line: 63
    if (Status == BookingStatus.Cancelled)
        throw new InvalidOperationException("Cannot confirm a cancelled booking."); // Line: 65
    if (Status != BookingStatus.Pending)
        throw new InvalidOperationException($"Cannot confirm a booking with status '{Status}'."); // Line: 68
    Status = BookingStatus.Confirmed;                                           // Line: 69
}
```

**`API/Services/BookingManagementService.cs`**

Two additions:

1. `ValidateStatusTransition()` — codifies the legal state machine:

| From | To | Allowed |
|---|---|---|
| `Pending` | `Confirmed` | ✓ |
| `Pending` | `Cancelled` | ✓ |
| `Confirmed` | `Cancelled` | ✓ |
| `Confirmed` | `Pending` | ✗ Cannot revert |
| `Cancelled` | `*` | ✗ Terminal state |
| `*` | same | ✗ No-op rejected |

2. `ApplyStatusChange()` changed from `void` (direct assignment) to `(bool isValid, string? errorMessage)` — it now calls `ValidateStatusTransition` first, then routes through the domain entity methods `Confirm()` or `Cancel()`, catching `InvalidOperationException` as a validation failure.
- `ValidateStatusTransition` — Line: 185
- `ApplyStatusChange` — Line: 207

**`API/Controllers/BookingController.cs`**

`UpdateBooking` now checks the result and returns `ValidationProblemDetails` on illegal transitions:
```csharp
var stateResult = _bookingManagementService.ApplyStatusChange(booking, newStatus); // Line: 410
if (!stateResult.isValid)                                                           // Line: 411
{
    problem.Errors["Status"] = new[] { stateResult.errorMessage! };                // Line: 414
    return BadRequest(problem);
}
```

---

## 5. Constraints

### What Changed
Two constraint violations were found and fixed.

### How It Was Implemented

**No Native Fetch — `src/components/ConnectionStatus.jsx`**

Was importing from `services/api.js` (a stale duplicate `axios.create()` instance). Fixed to use the canonical singleton:
```javascript
// Before
import apiClient from '../services/api';
// After
import apiClient from '../api/apiClient'; // Line: 7
```

**Hook Discipline — `src/hooks/useAuth.js` (new file)**

All auth logic was extracted from `App.jsx` into a dedicated `useAuth` custom hook:
- Owns `isLoggedIn`, `currentUser`, `showLoginForm`, `refreshKey` state
- Registers the `auth:unauthorized` event listener with cleanup
- Exposes `login()` and `logout()` via `useCallback`
- Accepts an `onSessionExpired` callback so the hook stays decoupled from toast/UI logic

`App.jsx` now uses a single line:
```javascript
const { isLoggedIn, currentUser, showLoginForm, setShowLoginForm,  // Line: 75
        refreshKey, login, logout } = useAuth({ onSessionExpired }); // Line: 82
```

**Immutability** — already fully compliant; all state updates use `.filter()`, `.map()`, `[...spread]`, and functional updater patterns.
---

## 6. BookingCard "Time: to" — Missing Fields in `BookingSummaryDTO`

### What Changed
The booking list cards were showing **"Time: to"** with no times because the DTO returned by `GET /Booking` did not include `StartTime` or `EndTime`.

### How It Was Implemented

**`API/DTO/BookingSummaryDTO.cs`**

Two fields were added:
```csharp
public DateTimeOffset StartTime { get; set; } // Line: 13
public DateTimeOffset EndTime   { get; set; } // Line: 14
```

**`API/Data/BookingRepository.cs`**

The `GetAllBookingsPaginatedAsync` projection was updated to map both new fields:
```csharp
StartTime = b.StartTime, // Line: 73
EndTime   = b.EndTime,   // Line: 74
```

**`src/components/BookingCard.jsx`**

A `fmt()` helper was added to format ISO strings to human-readable datetime, and the time row now renders both values:
```javascript
const fmt = (iso) =>                                                             // Line: 17
  new Date(iso).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });

<p>Time: {fmt(booking.startTime)} to {fmt(booking.endTime)}</p>                 // Line: 29
```

---

## 7. Extra Credit — SignalR Real-Time Sync

### What Changed
A SignalR WebSocket hub was added to the backend and a `useSignalR` custom hook to the frontend. Every booking or room mutation now broadcasts an event to all connected clients, keeping every open tab in sync without a manual refresh.

### How It Was Implemented

**`API/Hubs/BookingHub.cs`** *(new file)*

A thin hub class — broadcast logic lives in controllers via `IHubContext<BookingHub>`:
```csharp
namespace ConferenceBooking.API.Hubs;
public class BookingHub : Hub { }  // Line: 10
```

**`API/API.csproj`**

Added explicit compile glob because `<EnableDefaultCompileItems>false</EnableDefaultCompileItems>` was set, causing CS0234 on the new namespace:
```xml
<Compile Include="Hubs\**\*.cs" />  <!-- Line: 56 -->
```

**`API/Program.cs`**

- `builder.Services.AddSignalR()` — Line: 93
- `JwtBearerEvents.OnMessageReceived` reads `?access_token=` from the query string when the path starts with `/hubs` (browsers cannot set `Authorization` headers on WebSocket handshakes) — Line: 64
- CORS changed from `WithMethods("GET","POST","PUT","DELETE")` to `AllowAnyMethod()` — Line: 87
- `app.MapHub<BookingHub>("/hubs/booking")` — Line: 186

**`API/Controllers/BookingController.cs`**

`IHubContext<BookingHub>` injected. Every mutation broadcasts with a `By` field carrying the acting username:

| Action | Event | Line |
|---|---|---|
| `POST /Booking` | `BookingCreated` | 326 |
| `PUT /Booking/{id}` | `BookingUpdated` | 426 |
| `DELETE /Booking/{id}/cancel` | `BookingCancelled` | 499 |
| `DELETE /Booking/{id}` | `BookingDeleted` | 528 |

```csharp
await _hubContext.Clients.All.SendAsync("BookingCreated",
    new { Data = responseDto, By = User.Identity?.Name ?? "Unknown" }); // Line: 326
```

**`API/Controllers/RoomManagementController.cs`**

Same pattern for room events:

| Action | Event | Line |
|---|---|---|
| `POST /RoomManagement` | `RoomCreated` | 130 |
| `PUT /RoomManagement/{id}` | `RoomUpdated` | 84 |
| `PATCH /RoomManagement/{id}/status` | `RoomUpdated` | 47 |
| `DELETE /RoomManagement/{id}` | `RoomDeleted` | 161 |

**`src/hooks/useSignalR.js`** *(new file)*

Custom hook accepting `{ onBookingChange, onRoomChange }`. Uses `useRef` to hold the latest callbacks without re-running the effect on every render:

```javascript
const connection = new signalR.HubConnectionBuilder()        // Line: 45
  .withUrl(HUB_URL, {
    accessTokenFactory: () => localStorage.getItem('token') ?? '', // Line: 49
  })
  .withAutomaticReconnect()                                   // Line: 51
  .configureLogging(signalR.LogLevel.Warning)
  .build();

connection.on('BookingCreated',   (data) => bookingCallbackRef.current?.('BookingCreated', data));   // Line: 56
connection.on('BookingUpdated',   (data) => bookingCallbackRef.current?.('BookingUpdated', data));   // Line: 59
connection.on('BookingCancelled', (data) => bookingCallbackRef.current?.('BookingCancelled', data)); // Line: 62
connection.on('BookingDeleted',   (data) => bookingCallbackRef.current?.('BookingDeleted', data));   // Line: 65
connection.on('RoomCreated',  (data) => roomCallbackRef.current?.('RoomCreated', data));  // Line: 70
connection.on('RoomUpdated',  (data) => roomCallbackRef.current?.('RoomUpdated', data));  // Line: 73
connection.on('RoomDeleted',  (data) => roomCallbackRef.current?.('RoomDeleted', data));  // Line: 76
```

Cleanup: `connection.stop()` on unmount — Line: 88 — prevents orphaned WebSocket connections.

**`src/App.jsx`**

`useSignalR` called once at App level. Each callback re-fetches the relevant list and fires the orange remote toast:
```javascript
useSignalR({                                                         // Line: 102
  onBookingChange: useCallback(async (eventName, payload) => {
    const data = await bookingService.fetchAllBookings();
    setAllBookings(data); setFilteredBookings(data);
    setToastRemote({ show: true, message: `A booking was ... by "${payload?.By}"`, type: 'warning' }); // Line: 115
  }, []),
  onRoomChange: useCallback(async (eventName, payload) => { ... }, []), // Line: 117 (similar pattern)
});
```

---

## 8. Dual Toast System — Green (local) + Orange (remote)

### What Changed
The single toast state was split into two independent states so both the green success toast (local action) and the orange SignalR notification (remote event) can appear simultaneously without one overwriting the other.

### How It Was Implemented

**`src/components/Toast.css`**

Two new rules added:
```css
/* Orange — SignalR remote events */
.toast-warning {           /* Line: 50 */
  background: #f97316;     /* Line: 51 */
  color: white;
}

/* Stacks below the primary green toast */
.toast-remote {            /* Line: 56 */
  top: 90px;
}
```

**`src/components/Toast.jsx`**

- Accepts a `className` prop applied to the wrapper `<div>` — Line: 16 — so callers can offset it with `.toast-remote`
- Added `case 'warning': return '⚡'` to the icon switch — Line: 38

**`src/App.jsx`**

```javascript
// Second toast state — dedicated to orange remote notifications
const [toastRemote, setToastRemote] = useState({ show: false, message: '', type: 'warning' }); // Line: 71

const handleCloseToastRemote = () => {                                          // Line: 509
  setToastRemote({ ...toastRemote, show: false });
};

{toastRemote.show && (                                                          // Line: 584
  <Toast
    message={toastRemote.message}
    type={toastRemote.type}
    onClose={handleCloseToastRemote}
    className="toast-remote"                                                    // Line: 589
  />
)}
```

Orange toast messages include the actor username from the `By` field in the SignalR payload:
```
"A booking was deleted by "admin"."
"A room was updated by "receptionist1"."
```

**Behaviour summary:**

| User | Green toast | Orange toast |
|---|---|---|
| You (acting user) | Your local success | SignalR echo (you are in `Clients.All`) |
| Remote user | none | Server-pushed event |