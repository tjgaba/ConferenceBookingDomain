# Troubleshoot — Errors & Fixes

## Overview

This document covers every error encountered during the implementation sprint. Each entry includes the symptom, root cause, and the exact code change that resolved it. Issues are ordered from identification to resolution.

---

## 1. `ApplyStatusChange` Bypassed the Domain State Machine

### Symptom
A booking that had been `Cancelled` could be set back to `Confirmed` via a `PUT /Booking/{id}` request. No error was returned. The booking status was overwritten directly in the service.

### Root Cause
`ApplyStatusChange` used a direct property assignment instead of routing through the domain entity's methods:

```csharp
// Old — bypassed all guard logic
private void ApplyStatusChange(Booking booking, BookingStatus newStatus)
{
    booking.Status = newStatus;
}
```

`Booking.Confirm()` and `Booking.Cancel()` existed and contained guard clauses, but were never called. The state machine was completely bypassed.

### Fix

**`API/Services/BookingManagementService.cs`**

Added `ValidateStatusTransition()` to guard every transition before it is attempted, then routed `ApplyStatusChange` through the domain entity methods:

```csharp
private (bool isValid, string? errorMessage) ValidateStatusTransition(   // Line: 185
    BookingStatus current, BookingStatus requested)
{
    if (current == requested)
        return (false, $"Booking is already {current}.");
    if (current == BookingStatus.Cancelled)
        return (false, "Cannot change status of a cancelled booking.");
    if (current == BookingStatus.Confirmed && requested == BookingStatus.Pending)
        return (false, "Cannot revert a confirmed booking to pending.");
    return (true, null);
}

public (bool isValid, string? errorMessage) ApplyStatusChange(           // Line: 207
    Booking booking, BookingStatus newStatus)
{
    var transition = ValidateStatusTransition(booking.Status, newStatus); // Line: 209
    if (!transition.isValid) return transition;

    try
    {
        if (newStatus == BookingStatus.Confirmed)  booking.Confirm();
        else if (newStatus == BookingStatus.Cancelled) booking.Cancel();
        return (true, null);
    }
    catch (InvalidOperationException ex)
    {
        return (false, ex.Message);
    }
}
```

The `void` return type was changed to `(bool, string?)` so the controller can surface the failure as a `ValidationProblemDetails` response rather than swallowing it silently.

---

## 2. `Booking.Confirm()` Threw a Messageless Exception

### Symptom
When an illegal state transition was caught at the service level, `ex.Message` was blank. The `ValidationProblemDetails` error surfaced to the client as an empty string, giving no indication of what had failed.

### Root Cause
`Confirm()` and `Cancel()` called `throw new InvalidOperationException()` with no message argument:

```csharp
// Old — no message
public void Confirm()
{
    if (Status != BookingStatus.Pending)
        throw new InvalidOperationException();
    Status = BookingStatus.Confirmed;
}
```

### Fix

**`API/Models/Booking.cs`**

Every guard clause now includes a descriptive message, and each illegal path is handled individually rather than with a single generic check:

```csharp
public void Confirm()                                                              // Line: 60
{
    if (Status == BookingStatus.Confirmed)
        throw new InvalidOperationException("Booking is already confirmed.");      // Line: 63
    if (Status == BookingStatus.Cancelled)
        throw new InvalidOperationException("Cannot confirm a cancelled booking."); // Line: 65
    if (Status != BookingStatus.Pending)
        throw new InvalidOperationException($"Cannot confirm a booking with status '{Status}'."); // Line: 68
    Status = BookingStatus.Confirmed;                                              // Line: 69
}
```

---

## 3. Backend 400 Responses Were Not Field-Keyed

### Symptom
When a validation rule failed (e.g., booking outside business hours, room at capacity), the API returned:
```json
{ "message": "Booking start time must be between 08:00 and 16:00." }
```
The React form had no way to know which field the error belonged to, so it could not display the message under the correct input.

### Root Cause
`BookingValidationService` methods returned a `(bool isValid, string? errorMessage)` tuple with no `fieldName`. The controllers then returned `BadRequest(new { message = ... })` — a plain object, not a `ValidationProblemDetails`.

### Fix — Part 1: Service Return Type

**`API/Services/BookingValidationService.cs`**

`ValidateBusinessHours`, `ValidateBookingCreationAsync`, and `ValidateBookingUpdateAsync` all had their return types extended to include a `fieldName`:

```csharp
// Before
Task<(bool, string?, ConferenceRoom?)>

// After
Task<(bool isValid, string? errorMessage, string? fieldName, ConferenceRoom? room)>
// ValidateBookingCreationAsync — Line: 161
// ValidateBookingUpdateAsync  — Line: 209
// ValidateBusinessHours       — Line: 66
```

Each failure site now specifies the field it belongs to:
```csharp
// e.g. date overlap maps to StartDate
return (false, "This room is already booked during the requested time.", "StartDate", null);
```

### Fix — Part 2: Controller Response Shape

**`API/Controllers/BookingController.cs`**

Replaced `BadRequest(new { message })` with a proper `ValidationProblemDetails`:

```csharp
var problem = new ValidationProblemDetails();                                    // Line: 293
problem.Errors[validation.fieldName ?? "General"] = new[] { validation.errorMessage! }; // Line: 295
return BadRequest(problem);
```

The response shape follows RFC 7807:
```json
{
  "title": "One or more validation errors occurred.",
  "status": 400,
  "errors": {
    "StartDate": ["This room is already booked during the requested time."]
  }
}
```

### Fix — Part 3: React Error Parsing

**`src/App.jsx`**

The Axios catch block was updated to read `err.response.data.errors` and map every known field key to the corresponding React form state:

```javascript
const mapped = {};
if (e.RoomId)     mapped.roomId    = e.RoomId[0];    // Line: 333
if (e.StartDate)  mapped.startTime = e.StartDate[0]; // Line: 334
if (e.StartTime)  mapped.startTime = e.StartTime[0]; // Line: 337 — PUT DTO field name
if (e.EndDate)    mapped.endTime   = e.EndDate[0];   // Line: 335
if (e.EndTime)    mapped.endTime   = e.EndTime[0];   // Line: 338 — PUT DTO field name
if (e.Capacity)   mapped.general   = e.Capacity[0];
if (e.Status)     mapped.general   = e.Status[0];
setBookingFormErrors(mapped);
```

---

## 4. 401 Responses Did Not Trigger Logout

### Symptom
When the JWT expired mid-session, Axios received a 401 response. The tokens were cleared from `localStorage`, but the React UI did not react — `isLoggedIn` remained `true`, the booking list was still visible, and no prompt appeared for the user to log in again.

### Root Cause
The Axios response interceptor in `apiClient.js` could not call React state setters because it lives outside the React component tree. After clearing `localStorage`, there was no mechanism to notify the app that auth state had changed.

### Fix

**`src/api/apiClient.js`**

A `CustomEvent` is dispatched after clearing storage:

```javascript
apiClient.interceptors.response.use(                           // Line: 38
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {                      // Line: 44
      localStorage.removeItem('token');                        // Line: 45
      localStorage.removeItem('refreshToken');                 // Line: 46
      localStorage.removeItem('user');                         // Line: 47
      window.dispatchEvent(new CustomEvent('auth:unauthorized')); // Line: 50
    }
    return Promise.reject(error);
  }
);
```

**`src/hooks/useAuth.js`**

`useAuth` registers a `window` event listener that fires the logout callback:

```javascript
useEffect(() => {
  const handleUnauthorized = () => {                           // Line: 34
    setIsLoggedIn(false);                                      // Line: 35
    setCurrentUser(null);                                      // Line: 36
    onSessionExpired?.('Your session expired. Please log in again.');
  };
  window.addEventListener('auth:unauthorized', handleUnauthorized); // Line: 40
  return () => window.removeEventListener('auth:unauthorized', handleUnauthorized); // Line: 41
}, [onSessionExpired]);
```

The interceptor and the React hook are decoupled — neither imports the other.

---

## 5. `ConnectionStatus.jsx` Used a Stale Duplicate Axios Instance

### Symptom
`ConnectionStatus` health checks did not include the `Authorization: Bearer <token>` header, despite all other requests being authenticated. Separately, response data was wrapped in an Axios response envelope rather than being unwrapped (because the response interceptor wasn't attached).

### Root Cause
The file imported from `services/api.js` — a secondary file that called `axios.create()` independently and was never updated with the canonical interceptors:

```javascript
// Wrong
import apiClient from '../services/api';
```

### Fix

**`src/components/ConnectionStatus.jsx`**

Changed to import the canonical singleton:

```javascript
// Correct
import apiClient from '../api/apiClient'; // Line: 7
```

The canonical instance has both the request interceptor (JWT attachment) and the response interceptor (unwrapping + 401 handling). All HTTP traffic now flows through one Axios instance.

---

## 6. Auth Logic Scattered Across `App.jsx` (Hook Discipline Violation)

### Symptom
All authentication state (`isLoggedIn`, `currentUser`, `showLoginForm`) and all related effects and handlers were declared inline in `App.jsx`. The constraint required a dedicated `useAuth` hook.

### Root Cause
The hook was never created. App.jsx had grown to own both rendering logic and auth side-effects.

### Fix

**`src/hooks/useAuth.js`** was created, extracting:

| Moved Item | From | To |
|---|---|---|
| `isLoggedIn` state | `App.jsx` | `useAuth.js` |
| `currentUser` state | `App.jsx` | `useAuth.js` |
| `showLoginForm` state | `App.jsx` | `useAuth.js` |
| `refreshKey` state | `App.jsx` | `useAuth.js` |
| `auth:unauthorized` listener | `App.jsx` | `useAuth.js` |
| `login()` handler logic | `App.jsx` | `useAuth.js` |
| `logout()` handler logic | `App.jsx` | `useAuth.js` |

`App.jsx` now delegates entirely:
```javascript
const { isLoggedIn, currentUser, showLoginForm, setShowLoginForm, // Line: 75
        refreshKey, login, logout } = useAuth({ onSessionExpired }); // Line: 82
```

State declarations inside `useAuth.js`:
```javascript
const [isLoggedIn,    setIsLoggedIn]    = useState(...)  // Line: 23
const [currentUser,   setCurrentUser]   = useState(...)  // Line: 24
const [showLoginForm, setShowLoginForm] = useState(false) // Line: 25
const [refreshKey,    setRefreshKey]    = useState(0)     // Line: 28
```

---

## 7. MSB3026 / MSB3027 — File Locked Build Error

### Symptom
Running `dotnet build` during development produced:

```
MSB3026: Could not copy "obj\Debug\net8.0\API.dll" to "bin\Debug\net8.0\API.dll".
MSB3027: Could not complete the copy of "API.dll" because it was opened by another process.
```

### Root Cause
The already-running `dotnet run` process held an exclusive lock on `API.exe` / `API.dll`. The build task tried to overwrite the file while it was in use.

### Fix
Stop the running API process before building (`Ctrl+C` in the API terminal), then run `dotnet build` / `dotnet run`. There were **zero `CS\d{4}` compiler errors** — the lock error was an infrastructure artifact, not a code problem. All C# changes compiled cleanly on the next run.

> **Tip:** Use `dotnet run` instead of `dotnet build` + manual launch; it rebuilds automatically and avoids this if the previous process has been stopped first.
---

## 8. CS0234 — `Hubs` Namespace Not Found After Adding `BookingHub`

### Symptom
Adding `API/Hubs/BookingHub.cs` and referencing `ConferenceBooking.API.Hubs` in `Program.cs` produced:
```
CS0234: The type or namespace name 'Hubs' does not exist in the namespace 'ConferenceBooking.API'
```

### Root Cause
`API.csproj` contained `<EnableDefaultCompileItems>false</EnableDefaultCompileItems>`, which disables MSBuild's automatic `**/*.cs` glob. The new `Hubs/` subdirectory was never compiled — the type simply did not exist at build time.

### Fix

**`API/API.csproj`**

Added an explicit compile glob covering the new folder:
```xml
<Compile Include="Hubs\**\*.cs" />  <!-- Line: 56 -->
```
The error disappeared on the next `dotnet run`.

---

## 9. CORS Blocked SignalR Negotiate Request

### Symptom
After wiring up `useSignalR`, the browser DevTools Network tab showed the `/hubs/booking/negotiate` pre-flight failing with a CORS error. The WebSocket connection never opened.

### Root Cause
The CORS policy used an explicit method allow-list:
```csharp
.WithMethods("GET", "POST", "PUT", "DELETE")
```
SignalR's negotiate endpoint uses additional HTTP methods not in that list. The browser's `OPTIONS` pre-flight check was rejected before the handshake could begin.

### Fix

**`API/Program.cs`**

Replaced the explicit list with `AllowAnyMethod()`:
```csharp
// Before
.WithMethods("GET", "POST", "PUT", "DELETE")

// After
.AllowAnyMethod() // Line: 87
```
The negotiate and connect calls succeeded on the next restart.

---

## 10. JWT Not Sent on WebSocket Handshake

### Symptom
After the CORS fix, the WebSocket connected but any hub endpoint decorated with `[Authorize]` rejected the connection with `401 Unauthorized` during the negotiate step.

### Root Cause
Browsers do not allow JavaScript to set custom HTTP headers (like `Authorization: Bearer ...`) on the WebSocket upgrade request. The JWT therefore never reached the server during the handshake.

### Fix — Part 1: Frontend

**`src/hooks/useSignalR.js`**

`accessTokenFactory` passes the token as a query string parameter:
```javascript
.withUrl(HUB_URL, {
  accessTokenFactory: () => localStorage.getItem('token') ?? '', // Line: 49
})
```
The SignalR client library appends this as `?access_token=<token>` on the negotiate request.

### Fix — Part 2: Backend

**`API/Program.cs`**

`JwtBearerEvents.OnMessageReceived` reads the token from the query string when the request path starts with `/hubs`:
```csharp
events.OnMessageReceived = context => // Line: 64
{
    var token = context.Request.Query["access_token"]; // Line: 66
    if (!string.IsNullOrEmpty(token) &&
        context.HttpContext.Request.Path.StartsWithSegments("/hubs"))
        context.Token = token;
    return Task.CompletedTask;
};
```
The JWT middleware then validates the token normally and the connection is authenticated.

---

## 11. BookingCard Showing "Time: to" (Missing DTO Fields)

### Symptom
Every booking card in the UI displayed **"Time: to"** — no start or end time was shown.

### Root Cause
`GET /Booking` returns `BookingSummaryDTO`, which only contained a `Date` field. `BookingCard.jsx` referenced `booking.startTime` and `booking.endTime`, but those properties were `undefined` because they were never projected from the entity into the DTO.

### Fix

**`API/DTO/BookingSummaryDTO.cs`** — fields added:
```csharp
public DateTimeOffset StartTime { get; set; } // Line: 13
public DateTimeOffset EndTime   { get; set; } // Line: 14
```

**`API/Data/BookingRepository.cs`** — projection updated:
```csharp
StartTime = b.StartTime, // Line: 73
EndTime   = b.EndTime,   // Line: 74
```

**`src/components/BookingCard.jsx`** — `fmt()` helper added:
```javascript
const fmt = (iso) => // Line: 17
  new Date(iso).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
```
Cards now display e.g. **"Mar 5, 2026, 9:00 AM to Mar 5, 2026, 11:00 AM"**.