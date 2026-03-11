
# 🏢 Conference Room Booking System

## 📚 Table of Contents

* [Overview](#-overview)
* [What Changed Recently](#-what-changed-recently)
* [Solution Structure](#-solution-structure)
* [Technology Stack](#️-technology-stack)
* [Authentication & Authorization](#-authentication--authorization)
* [Frontend Architecture](#-frontend-architecture)
* [Database Schema & Migrations](#️-database-schema--migrations)
* [Core Domain Concepts](#-core-domain-concepts)
* [Business Rules & Validation](#-business-rules--validation)
* [Exception Handling](#-exception-handling)
* [Persistence Strategy](#-persistence-strategy)
* [Backend Readiness Review](#️-backend-readiness-review)
* [Web API Endpoints](#-web-api-endpoints)
* [Design Principles Applied](#-design-principles-applied)
* [Getting Started](#-getting-started)
* [Possible Next Steps](#-possible-next-steps)
* [Author](#-author)

---

## 📌 Overview

A full-stack **Conference Room Booking System** built with **.NET 8** and **Next.js 16**. The solution follows clean architecture and domain-driven design on the backend, and a React Context + App Router pattern on the frontend.

The system supports the complete booking lifecycle — creating, confirming, and cancelling bookings — with real-time updates via **SignalR**, role-based access control for four user types, and a responsive two-project Next.js frontend with JWT authentication wired through React Context directly into Axios interceptors.

---

## 🆕 What Changed Recently

### Frontend (Next.js)

* ✅ **AuthProvider** with `useState` for JWT token — `token`, `isLoggedIn`, `currentUser`, `login`, `logout`
* ✅ **localStorage hydration** on mount — token and user restored from `localStorage` on page load
* ✅ **`useAuth` hook** — exported alias of `useAuthContext()` for consistent consumption pattern
* ✅ **`ProtectedRoute` component** — redirects unauthenticated users to `/login?from=<path>` using `useRouter`
* ✅ **Dashboard layout guard** — `app/dashboard/layout.tsx` wraps all `/dashboard/*` routes in `ProtectedRoute`
* ✅ **Axios interceptor integration** — `configureApiClient({ getToken, onUnauthorized })` wires AuthContext token into the request interceptor and `logout()` into the 401 response interceptor, replacing the old `CustomEvent` bridge
* ✅ **`hadToken` 401 guard** — prevents infinite logout loop when `authService.logout()` POST itself returns 401
* ✅ **Role-based sidebar** — navigation items filtered by `currentUser.roles`; Room Management visible to `FacilityManager` only
* ✅ **Room Management page** — full CRUD table for FacilityManager: create, edit, activate/deactivate, remove
* ✅ **Activate/Deactivate fix** — corrected PATCH URL to `/RoomManagement/{id}/status` to match backend route
* ✅ **Pagination** — Room Management table shows 5 rows per page with Prev/Next controls; filters reset to page 1
* ✅ **Collapsible sections** — Bookings and Rooms sections on Dashboard, Bookings tab, and Rooms tab all start collapsed and can be expanded/collapsed by clicking the header
* ✅ **SignalR** — real-time room and booking change push notifications across all dashboard pages
* ✅ **`'use client'` boundary discipline** — dashboard pages correctly marked as Client Components; layout stays a Server Component shell

### Backend (.NET 8)

* ✅ **ASP.NET Core Identity** with JWT authentication
* ✅ **Entity Framework Core** with PostgreSQL database
* ✅ **Role-based authorization** (Admin, Receptionist, Employee, FacilityManager)
* ✅ **Two-step booking workflow** (Pending → Confirmed by Receptionist)
* ✅ **Room management** with soft-delete (IsActive flag)
* ✅ **7 EF Core Migrations** applied
* ✅ **Seeded test data** (25 active rooms, 1 inactive room, 4 users with roles)
* ✅ **SignalR Hub** — broadcasts `RoomCreated`, `RoomUpdated`, `RoomDeleted`, `BookingCreated`, `BookingUpdated`, `BookingCancelled`, `BookingDeleted` events
* ✅ **Centralized exception handling** middleware
* ✅ **Pagination + sorting** on all list endpoints

---

## 🧱 Solution Structure

```
ConferenceBookingDomain/
│
├── API/                              # ASP.NET Core Web API (port 5230)
│   ├── Controllers/
│   │   ├── AuthController.cs              # JWT login / logout
│   │   ├── BookingController.cs           # Create, confirm, cancel, update, delete
│   │   ├── RoomController.cs              # List rooms, check availability
│   │   ├── RoomManagementController.cs    # CRUD rooms (FacilityManager/Admin)
│   │   ├── ConferenceSessionController.cs # Session management
│   │   └── UserManagementController.cs    # Admin user management
│   ├── Auth/
│   │   ├── ApplicationUser.cs             # Identity user (IsActive, DeletedAt)
│   │   ├── IdentitySeeder.cs              # Seeds users, roles, rooms
│   │   └── TokenService.cs                # JWT generation
│   ├── Data/
│   │   ├── ApplicationDbContext.cs        # EF Core DbContext
│   │   ├── BookingRepository.cs
│   │   └── ConferenceRoomRepository.cs
│   ├── DTO/                               # Request & response DTOs
│   ├── Entities/                          # Domain entities
│   ├── Exceptions/                        # Custom domain exceptions
│   ├── Hubs/
│   │   └── BookingHub.cs                  # SignalR hub
│   ├── Interfaces/                        # Service & repository interfaces
│   ├── Middleware/
│   │   └── ExceptionHandlingMiddleware.cs
│   ├── Migrations/                        # 7 EF Core migrations
│   ├── Models/                            # EF Core entity models
│   ├── Persistence/                       # Repository implementations
│   ├── Services/                          # Business logic services
│   └── Program.cs
│
├── ConferenceBookingWeb/             # Next.js 16 frontend — primary (port 3000)
│   ├── app/
│   │   ├── layout.tsx                     # Server Component root layout
│   │   ├── AppShell.tsx                   # 'use client' shell — holds AuthProvider
│   │   ├── page.tsx                       # Landing page
│   │   ├── login/page.tsx
│   │   └── dashboard/
│   │       ├── layout.tsx                 # ProtectedRoute guard for all /dashboard/* routes
│   │       ├── page.tsx                   # Dashboard overview (Bookings + Rooms, collapsible)
│   │       ├── DashboardHomeClient.tsx
│   │       ├── bookings/
│   │       │   ├── page.tsx
│   │       │   └── BookingsPageClient.tsx # Bookings CRUD, collapsible section
│   │       ├── rooms/
│   │       │   ├── page.tsx
│   │       │   └── RoomsPageClient.tsx    # Rooms view, collapsible section
│   │       └── room-management/
│   │           ├── page.tsx
│   │           ├── RoomManagementPageClient.tsx  # FacilityManager CRUD, paginated table
│   │           └── RoomManagement.css
│   └── src/
│       ├── api/
│       │   └── apiClient.js               # Axios singleton + configureApiClient()
│       ├── context/
│       │   └── AuthContext.jsx            # AuthProvider, useAuthContext, useAuth
│       ├── hooks/
│       │   ├── useAuth.js                 # token/isLoggedIn/currentUser state
│       │   └── useSignalR.js              # SignalR connection + event subscription
│       ├── components/                    # Header, Sidebar, BookingList, RoomList, …
│       ├── services/                      # bookingService.js, roomService.js, authService.js
│       └── dto/                           # Frontend DTO builders
│
├── ConferenceBookingClient/          # Next.js 16 frontend — legacy (superseded by Web)
│
├── docker-compose.yml                # PostgreSQL container
├── Dockerfile
└── README.md
```

---

## 🛠️ Technology Stack

### Backend
| Technology | Version | Purpose |
|---|---|---|
| .NET / ASP.NET Core | 8 | Web API framework |
| Entity Framework Core | 8 | ORM + migrations |
| PostgreSQL | Latest | Relational database |
| ASP.NET Core Identity | 8 | User auth & roles |
| JWT Bearer | — | Stateless token authentication |
| SignalR | 8 | Real-time push notifications |
| Swagger / OpenAPI | — | Interactive API docs |

### Frontend (ConferenceBookingWeb)
| Technology | Version | Purpose |
|---|---|---|
| Next.js | 16.1.6 | React framework (App Router, Turbopack) |
| React | 19 | UI library |
| TypeScript | 5 | Type safety on page/layout files |
| Axios | — | HTTP client (singleton with interceptors) |
| SignalR JS client | — | Real-time hub subscription |
| CSS Modules / global CSS | — | Styling |

---

## 🔐 Authentication & Authorization

### Flow

```
User logs in → POST /api/auth/login
  → JWT token returned
  → Stored in localStorage
  → AuthContext reads token on mount (hydration)
  → Axios request interceptor reads token via _getToken() from AuthContext
  → 401 response → Axios calls logout() from AuthContext directly
  → ProtectedRoute redirects to /login if no token
```

### Auth Architecture

**`useAuth.js`** manages all auth state:
- `token` — JWT string or `null`
- `isLoggedIn` — boolean derived from token
- `currentUser` — decoded user payload (`{ username, roles }`)
- `login(username, password)` — calls authService, stores token, updates state
- `logout()` — clears localStorage and all state

**`AuthContext.jsx`** wraps the app:
- Calls `useAuth()` once — single source of truth
- Runs `configureApiClient({ getToken, onUnauthorized })` in a `useEffect` to wire Context into the Axios singleton
- Exports `useAuthContext()` and `useAuth` alias

**`apiClient.js`** Axios singleton:
- `configureApiClient({ getToken, onUnauthorized })` — called by AuthProvider; stores callback references
- Request interceptor calls `_getToken()` (→ `auth.token` from Context)
- 401 response interceptor checks `hadToken` before calling `_onUnauthorized()` (→ `auth.logout()`) — prevents infinite loop

**`ProtectedRoute.tsx`** route guard:
- Reads `token` from `useAuthContext()`
- Redirects to `/login?from=<pathname>` if no token
- Returns `null` while hydrating (prevents flash)

### Roles & Permissions

| Role | Bookings | Rooms (view) | Room Management | User Management |
|---|---|---|---|---|
| **Admin** | ✅ Full | ✅ | ❌ | ✅ |
| **Receptionist** | ✅ Confirm | ✅ | ❌ | ❌ |
| **Employee** | ✅ Create/Cancel | ✅ | ❌ | ❌ |
| **FacilityManager** | ✅ View | ✅ | ✅ | ❌ |

### Test Credentials

| Role | Username | Password |
|---|---|---|
| Admin | `admin` | `Admin@123` |
| Receptionist | `receptionist` | `Receptionist@123` |
| Employee | `employee` | `Employee@123` |
| FacilityManager | `facilitymanager` | `FacilityManager@123` |

---

## 🖥️ Frontend Architecture

### Next.js App Router Layout Pattern

```
app/layout.tsx          ← Server Component (metadata, font, CSS)
  └── AppShell.tsx      ← 'use client' — holds AuthProvider, Header, Sidebar
        └── AuthProvider
              └── {children}  ← page content
```

The `AuthProvider` lives in `AppShell.tsx` (a Client Component) so it can use React hooks, while `layout.tsx` stays a Server Component for SSR metadata benefits.

### Dashboard Route Guard

```
app/dashboard/layout.tsx       ← Server Component shell
  └── <ProtectedRoute>         ← 'use client' — redirects to /login if no token
        └── {children}         ← all /dashboard/* pages
```

All pages under `/dashboard/` are automatically protected without wrapping each page individually.

### Sidebar Navigation (Role-Based)

The Sidebar filters navigation items by `currentUser.roles`:

| Item | Visible to |
|---|---|
| Dashboard | All authenticated users |
| Bookings | All |
| Rooms | All |
| Room Management | FacilityManager only |

### Collapsible Sections

All major data panels start **collapsed** on page load to save vertical space. Click the section header to expand.

- **Dashboard tab**: Bookings Management + Rooms Management (each independent)
- **Bookings tab**: Bookings Management section
- **Rooms tab**: Rooms Management section

### Room Management Pagination

The Room Management table paginates at **5 rows per page** with Prev/Next controls and a "Page X of Y (N rooms)" indicator. All three filter inputs (search, status, location) reset to page 1 when changed.

### Real-Time Updates (SignalR)

All dashboard pages subscribe to the SignalR hub at `/hubs/booking`. On any server-side room or booking change, the relevant page refreshes its list and shows a warning toast identifying the actor.

Events handled:
- `RoomCreated`, `RoomUpdated`, `RoomDeleted`
- `BookingCreated`, `BookingUpdated`, `BookingCancelled`, `BookingDeleted`

---

## 🗄️ Database Schema & Migrations

### Applied Migrations (7 total)

| # | Name | Description |
|---|---|---|
| 1 | InitialCreate | Base Bookings + ConferenceRooms tables |
| 2 | AddSessionEntity | Sessions table with capacity validation |
| 3 | AddBookingTimestamps | CreatedAt (SQL default) + CancelledAt fields |
| 4 | AddRoomLocationAndIsActive | Location enum + IsActive soft-delete flag |
| 5 | StandardizeRoomsAcrossLocations | 25 rooms seeded across 5 locations |
| 6 | AddLocationAndCapacityToBooking | Location + Capacity added to Booking |
| 7 | SeedRequiredTestData | Test data: inactive room, session, confirmed booking |

### Seed Data

| Requirement | Satisfied By |
|---|---|
| At least one active room | 25 active rooms across 5 locations |
| At least one inactive room | Room 26 (Archived Meeting Room) |
| At least one session with valid time range | Session 9001 (Q1 Strategy Planning) |
| At least one non-default booking status | Booking 9001 (Confirmed) |

### Database Tables (Summary)

**Bookings** — Id, RoomId (FK), UserId (FK), RequestedBy, StartTime, EndTime, Status, CreatedAt, CancelledAt, Location, Capacity

**ConferenceRooms** — Id, Name, Capacity, Number, Location, IsActive, DeletedAt

**Sessions** — Id, RoomId (FK nullable), Title, Description, Capacity, StartTime, EndTime

**AspNetUsers** — Standard Identity tables + IsActive, DeletedAt

---

## 🧩 Core Domain Concepts

### Booking Workflow

```
Employee creates booking → Status: Pending
  ↓
Receptionist/Admin confirms → Status: Confirmed  (room now blocked)
  ↓
User/Admin cancels → Status: Cancelled  (CancelledAt timestamp set)
```

Only **Confirmed** bookings block room availability. Pending bookings don't prevent other bookings.

### RoomLocation (Enum)

`London` | `CapeTown` | `Johannesburg` | `Bloemfontein` | `Durban`

Serialized as strings in JSON (`"location": "London"`) for readability.

### BookingStatus (Enum)

`Pending` | `Confirmed` | `Cancelled`

### Soft Delete

Both `ConferenceRoom` and `ApplicationUser` use `IsActive` + `DeletedAt` instead of hard deletes. This preserves booking history and maintains referential integrity.

---

## 🛡 Business Rules & Validation

**Booking Rules:**
- ❌ Cannot book an inactive room
- ❌ Cannot create overlapping confirmed bookings for the same room
- ❌ Pending bookings do not block availability
- ❌ Bookings must be within business hours (08:00–16:00)
- ❌ Start time must be before end time
- ❌ Bookings must be on the same day (no multi-day)
- ❌ Requested capacity cannot exceed room capacity

**Security Rules:**
- 🔒 All endpoints require JWT (`Authorization: Bearer <token>`)
- 🔒 Confirming bookings → `Receptionist` or `Admin` role
- 🔒 Deleting bookings → `Admin` role
- 🔒 Room management (create/update/delete/status) → `FacilityManager` or `Admin` role
- 🔒 JWT expires after 1 hour
- 🔒 Frontend 401 responses automatically trigger `logout()` via Axios interceptor

---

## ⚠️ Exception Handling

### Custom Exceptions

| Exception | HTTP Code | Scenario |
|---|---|---|
| `InvalidBookingException` | 400 | Business rule violation |
| `BookingConflictException` | 409 | Overlapping confirmed bookings |
| `BookingNotFoundException` | 404 | Resource not found |
| `BookingPersistenceException` | 500 | Database error |

`ExceptionHandlingMiddleware` catches all exceptions and returns clean JSON:

```json
{
  "success": false,
  "error": {
    "message": "Room is not available during the requested time.",
    "statusCode": 409
  }
}
```

---

## 💾 Persistence Strategy

- **PostgreSQL** via Docker + Entity Framework Core 8
- All DB operations are **async/await**
- **Repository Pattern** — `BookingRepository`, `ConferenceRoomRepository`
- **Soft delete** preserves referential integrity for historical data
- **Pagination** on all list endpoints via `Skip`/`Take` + `PaginatedResponseDTO<T>`
- **AsNoTracking** on read-only queries for performance
- **Foreign key constraints** — `ON DELETE RESTRICT` for Booking→Room and Booking→User

> See [Persistence-notes.md](Persistence-notes.md) and [Professional-Reasoning.md](Professional-Reasoning.md) for detailed architecture notes.

---

## 🏗️ Backend Readiness Review

### Frontend Support Features

| Feature | Implementation | Benefit |
|---|---|---|
| **Pagination** | `?page=1&pageSize=20` on all list endpoints | Handles large datasets |
| **Sorting** | `?sortBy=RoomName&sortOrder=asc` | Frontend controls order |
| **Filtering** | `?location=London&isActive=true` | Reduces network traffic |
| **DTOs** | Purpose-built response models | No over-fetching, no circular refs |
| **String Enums** | `JsonStringEnumConverter` | `"status": "Confirmed"` not `1` |
| **Error Handling** | Centralized middleware | 400 vs 409 vs 500 distinguished |
| **JWT Auth** | Stateless, 1-hour expiry | Token in `Authorization` header |
| **Pagination Metadata** | `totalCount`, `totalPages` in response | Build Next/Prev controls easily |
| **Real-Time** | SignalR hub `/hubs/booking` | Server pushes changes to all clients |

### PaginatedResponseDTO Shape

```json
{
  "totalCount": 142,
  "page": 2,
  "pageSize": 20,
  "totalPages": 8,
  "data": [ { "id": 21, "name": "Board Room A", ... } ]
}
```

---

## 🌐 Web API Endpoints

### Authentication
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/login` | Login — returns JWT | No |
| POST | `/api/auth/logout` | Logout | Yes |

### Bookings
| Method | Endpoint | Description | Role |
|---|---|---|---|
| POST | `/api/Booking/book` | Create booking (Pending) | Any |
| GET | `/api/Booking/all` | Get all bookings (paginated) | Any |
| GET | `/api/Booking/{id}` | Get booking by ID | Any |
| PUT | `/api/Booking/{id}` | Update booking | Any |
| PATCH | `/api/Booking/{id}/confirm` | Confirm booking | Receptionist/Admin |
| DELETE | `/api/Booking/{id}` | Delete booking | Admin |
| PATCH | `/api/Booking/{id}/cancel` | Cancel booking | Any |
| POST | `/api/Booking/filter` | Filter bookings by date/status | Any |

### Rooms
| Method | Endpoint | Description | Role |
|---|---|---|---|
| GET | `/api/Room` | Get all rooms (paginated, filterable) | Any |
| GET | `/api/Room/{id}` | Get room by ID | Any |
| POST | `/api/Room/check-available` | Check availability for time range | Any |

### Room Management
| Method | Endpoint | Description | Role |
|---|---|---|---|
| POST | `/api/RoomManagement` | Create room | FacilityManager/Admin |
| PUT | `/api/RoomManagement/{id}` | Update room details | FacilityManager/Admin |
| PATCH | `/api/RoomManagement/{id}/status` | Toggle active/inactive | FacilityManager/Admin |
| DELETE | `/api/RoomManagement/{id}` | Deactivate room (soft delete) | FacilityManager/Admin |

### User Management (Admin)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/UserManagement` | List all users |
| PATCH | `/api/UserManagement/{id}/status` | Activate/deactivate user |
| DELETE | `/api/UserManagement/{id}` | Delete user |

Swagger/OpenAPI available at `http://localhost:5230/swagger` in development.

---

## 🧠 Design Principles Applied

* **Clean Architecture** — Separation of concerns across domain, service, and infrastructure layers
* **Domain-Driven Design** — Business logic encapsulated in domain entities and services
* **Repository Pattern** — DbContext abstracted behind repositories
* **DTO Pattern** — API contracts decoupled from domain models
* **Two-Step Workflow** — Pending approval before room is blocked
* **Soft Delete** — `IsActive` flag preserves history and referential integrity
* **JWT Authentication** — Stateless, role-embedded tokens
* **React Context + Hook** — Single source of auth truth, no prop drilling
* **Axios Interceptor Bridge** — `configureApiClient()` connects React Context to the HTTP singleton
* **App Router + `'use client'` discipline** — Server Components for metadata/layout, Client Components only where state is needed
* **Collapsible Sections** — Progressive disclosure UX to reduce visual noise
* **Async/Await** — Non-blocking I/O throughout backend and frontend
* **Audit Trail** — `CreatedAt`, `CancelledAt`, `DeletedAt` timestamps

---

## 🚀 Getting Started

### Prerequisites

- .NET 8 SDK
- Node.js 20+
- Docker Desktop (for PostgreSQL)

### 1. Start the Database

```bash
docker-compose up -d
```

### 2. Run the API

```bash
dotnet run --project API/API.csproj
# API available at http://localhost:5230
# Swagger at http://localhost:5230/swagger
```

### 3. Run the Frontend

```bash
cd ConferenceBookingWeb
npm install
# .env.local is already in place:
# NEXT_PUBLIC_API_BASE_URL=http://localhost:5230/api
# NEXT_PUBLIC_HUB_URL=http://localhost:5230/hubs/booking
npm run dev
# App available at http://localhost:3000
```

### 4. Quick Test

**Login:**
```http
POST http://localhost:5230/api/auth/login
Content-Type: application/json

{ "username": "admin", "password": "Admin@123" }
```

**Create a booking:**
```http
POST http://localhost:5230/api/Booking/book
Authorization: Bearer <token>
Content-Type: application/json

{
  "roomId": 6,
  "startDate": "2026-04-01T09:00:00Z",
  "endDate": "2026-04-01T11:00:00Z",
  "location": "CapeTown",
  "capacity": 10
}
```

**Confirm it (as receptionist):**
```http
PATCH http://localhost:5230/api/Booking/{id}/confirm
Authorization: Bearer <receptionist-token>
```

---

## 🚀 Possible Next Steps

* ✅ ~~Replace JSON with a database~~ — EF Core + PostgreSQL
* ✅ ~~Add authentication & authorization~~ — JWT + ASP.NET Core Identity
* ✅ ~~Add room capacity & location tracking~~ — Location enum + Capacity field
* ✅ ~~Add booking workflow (Pending → Confirmed)~~ — Receptionist confirmation
* ✅ ~~Add room management (soft delete)~~ — IsActive flag
* ✅ ~~Build a frontend UI~~ — Next.js 16 App Router frontend
* ✅ ~~Add real-time notifications~~ — SignalR hub broadcasting to all clients
* ✅ ~~Wire auth into Axios interceptors~~ — `configureApiClient()` Context bridge
* ✅ ~~Add route guarding~~ — `ProtectedRoute` + dashboard layout guard
* ✅ ~~Role-based navigation~~ — Sidebar filtered by `currentUser.roles`
* ⬜ Add email notifications for booking confirmations
* ⬜ Implement recurring bookings
* ⬜ Add calendar view (week/month grid)
* ⬜ Add comprehensive unit & integration tests
* ⬜ Implement Redis caching for room availability
* ⬜ Add audit logging for compliance reporting
* ⬜ Deploy to cloud (Azure App Service + Azure Database for PostgreSQL)
* ⬜ Add multi-tenancy (separate organizations)
* ⬜ Integrate Google Calendar / Outlook sync

---

## ✍️ Author

**TJ Gaba**
