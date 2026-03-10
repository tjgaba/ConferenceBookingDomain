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
  hooks/                      useBookings, useSignalR
  services/                   authService, bookingService, roomService
  dto/                        DTO shape types
```
