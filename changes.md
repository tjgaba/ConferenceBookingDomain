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
const createBooking = useCallback(async (bookingData) => {
  const payload = { roomId, startDate, endDate, location, capacity }; // Req 2: DTO shape
  const created = await apiClient.post('/Booking', payload);
  await refetch(); // Req 3: Pessimistic Update
  return created;
}, [refetch]);

// Req 1: PUT — update an existing booking
const updateBooking = useCallback(async (bookingId, bookingData) => {
  const payload = { bookingId, roomId?, startTime?, endTime?, status? }; // Req 2: DTO shape
  const updated = await apiClient.put(`/Booking/${bookingId}`, payload);
  await refetch(); // Req 3: Pessimistic Update
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
```

Each rule failure now specifies which field caused it — `"RoomId"`, `"StartDate"`, `"EndDate"`, `"StartTime"`, `"EndTime"`, or `"Capacity"`. `ValidateBusinessHours` was similarly upgraded to return a `fieldName`.

**`API/Controllers/BookingController.cs`**

`CreateBooking` and `UpdateBooking` now build a `ValidationProblemDetails` using that `fieldName`:

```csharp
var problem = new ValidationProblemDetails();
problem.Errors[validation.fieldName ?? "General"] = new[] { validation.errorMessage! };
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
if (e.RoomId)    mapped.roomId    = e.RoomId[0];
if (e.StartDate) mapped.startTime = e.StartDate[0];
if (e.EndDate)   mapped.endTime   = e.EndDate[0];
// ... PUT field names (StartTime, EndTime) also covered
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
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

**`src/api/apiClient.js` — Response Interceptor (401 path)**

On a 401 response, clears all auth keys and fires a `CustomEvent` to decouple the interceptor from React state:
```javascript
if (error.response?.status === 401) {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  window.dispatchEvent(new CustomEvent('auth:unauthorized'));
}
```

**`src/services/authService.js`**

`login()` posts credentials to `/auth/login` via `apiClient` and stores the returned JWT:
```javascript
async login(username, password) {
  const response = await apiClient.post('/auth/login', { username, password });
  if (response.token) localStorage.setItem('token', response.token);
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
public void Confirm()
{
    if (Status == BookingStatus.Confirmed)
        throw new InvalidOperationException("Booking is already confirmed.");
    if (Status == BookingStatus.Cancelled)
        throw new InvalidOperationException("Cannot confirm a cancelled booking.");
    if (Status != BookingStatus.Pending)
        throw new InvalidOperationException($"Cannot confirm a booking with status '{Status}'.");
    Status = BookingStatus.Confirmed;
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

**`API/Controllers/BookingController.cs`**

`UpdateBooking` now checks the result and returns `ValidationProblemDetails` on illegal transitions:
```csharp
var stateResult = _bookingManagementService.ApplyStatusChange(booking, newStatus);
if (!stateResult.isValid)
{
    problem.Errors["Status"] = new[] { stateResult.errorMessage! };
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
import apiClient from '../api/apiClient';
```

**Hook Discipline — `src/hooks/useAuth.js` (new file)**

All auth logic was extracted from `App.jsx` into a dedicated `useAuth` custom hook:
- Owns `isLoggedIn`, `currentUser`, `showLoginForm`, `refreshKey` state
- Registers the `auth:unauthorized` event listener with cleanup
- Exposes `login()` and `logout()` via `useCallback`
- Accepts an `onSessionExpired` callback so the hook stays decoupled from toast/UI logic

`App.jsx` now uses a single line:
```javascript
const { isLoggedIn, currentUser, showLoginForm, setShowLoginForm,
        refreshKey, login, logout } = useAuth({ onSessionExpired });
```

**Immutability** — already fully compliant; all state updates use `.filter()`, `.map()`, `[...spread]`, and functional updater patterns.
