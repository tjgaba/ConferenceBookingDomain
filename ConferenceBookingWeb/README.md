# Conference Booking Web

Next.js 15 front-end for the Conference Booking Domain system. Connects to a .NET 8 REST API with JWT authentication, SignalR real-time updates, and role-based access control.

## Prerequisites

- Node.js 18+
- .NET 8 SDK (for the backend API)
- PostgreSQL (used by the API)

## Setup

```bash
npm install
npm run dev      # http://localhost:3000
```

Make sure the .NET API is running first:

```bash
# from the repo root
dotnet run --project API/API.csproj   # http://localhost:5230
```

## Environment variables

Create a `.env.local` file (or edit `app/.env`) and set:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:5230/api
NEXT_PUBLIC_HUB_URL=http://localhost:5230/hubs/booking
```

## Seeded accounts

| Role             | Email                            | Password              |
|------------------|----------------------------------|-----------------------|
| Admin            | admin@domain.com                 | Admin123!             |
| FacilityManager  | facilitymanager@domain.com       | FacilityManager123!   |
| Receptionist     | receptionist@domain.com          | Receptionist123!      |
| Employee         | employee@domain.com              | Employee123!          |

## Role-based access

| Tab              | Admin | FacilityManager | Receptionist | Employee |
|------------------|-------|-----------------|--------------|----------|
| Dashboard        | ✅    | ✅              | ❌           | ❌       |
| Bookings         | ✅    | ✅              | ✅           | ✅       |
| Rooms            | ✅    | ✅              | ❌           | ❌       |
| Room Management  | ❌    | ✅              | ❌           | ❌       |

## Features

- **Authentication** — JWT login/logout with token stored in `localStorage`; inline login prompt on access-denied pages
- **Bookings** — Create, view, filter, paginate, sort, confirm and cancel bookings
- **Rooms** — Browse conference rooms with availability status
- **Room Management** — FacilityManager-only CRUD: create, update, change status (active/inactive), deactivate/remove rooms
- **Real-time updates** — SignalR hub pushes booking and room changes live to all connected clients
- **Pagination & sorting** — Server-driven; configurable page size and sort column via query params

## Project structure

```
app/
  layout.tsx                  Root layout (AppShell, global nav)
  page.tsx                    Landing page
  login/                      Login route
  bookings/                   Bookings list route
  dashboard/
    page.tsx                  Dashboard home
    bookings/                 Dashboard bookings view
    rooms/                    Rooms listing
    room-management/          Room Management (FacilityManager only)
src/
  api/                        Axios singleton (apiClient)
  components/                 Shared UI: Sidebar, LoginForm, Toast, LoadingSpinner, ErrorMessage, Footer
  context/                    AuthContext (currentUser, login, logout)
  hooks/                      useBookings, useSignalR, useDebounce
  services/                   authService, bookingService, roomService
  dto/                        DTO shape types
```

## Polish Phase — Performance Optimisation

Using the React DevTools Profiler, recording while interacting with the filter dropdowns showed that `filteredBookings` — originally a state variable updated inside a `useEffect` — caused two render cycles per filter change, and that `BookingCard`/`BookingList` re-rendered on every parent state change even when their props were unchanged.

To fix this, `filteredBookings` and `filteredRooms` were converted to `useMemo` so the derived value is computed synchronously in the same render cycle (line 158 of `BookingsPageClient.tsx`). CRUD handlers were wrapped in `useCallback` to keep their references stable between renders (line 169), and `BookingCard`, `BookingList`, `RoomCard`, and `RoomList` were wrapped in `React.memo` so React skips re-rendering them when props haven't changed (line 12 of `BookingCard.jsx` and `BookingList.jsx`). Date formatting inside `BookingCard` was also moved into `useMemo` keyed on `booking.startTime`/`booking.endTime` (lines 13 and 17) to avoid redundant `toLocaleString` calls on every render.

Search was kept from flooding the API by a custom `useDebounce` hook (line 68 of `BookingsPageClient.tsx`) that delays the search value by 400 ms — the cleanup function cancels the timer on every keystroke so only the final value after the user pauses triggers the network request.
