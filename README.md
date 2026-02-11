
# 🏢 Conference Room Booking System (Domain + API)

## 📚 Table of Contents

* [Overview](#-overview)
* [Changes](#-what-changed-recently)
* [Solution Structure](#-solution-structure)
* [Core Domain Concepts](#-core-domain-concepts)
* [Business Rules & Validation](#-business-rules--validation)
* [Exception Handling](#-exception-handling)
* [Persistence Strategy](#-persistence-strategy)
* [Web API Endpoints](#-web-api-endpoints)
* [Design Principles Applied](#-design-principles-applied)
* [Getting Started](#-getting-started)
* [Possible Next Steps](#-possible-next-steps)
* [Author](#-author)

---

## 📌 Overview

This repository contains a **Conference Room Booking System** built with **.NET 8**, following clean architecture and domain‑driven design principles.
The solution includes a **pure domain layer** and an **ASP.NET Core Web API** with **Entity Framework Core** persistence and **JWT authentication**.

### 🛠 Technologies Used

- **.NET 8** - Latest C# and ASP.NET Core features
- **Entity Framework Core 8** - ORM with migration-based schema evolution
- **SQLite** - Lightweight development database
- **ASP.NET Core Identity** - User authentication & authorization
- **JWT (JSON Web Tokens)** - Stateless authentication
- **Swagger/OpenAPI** - Interactive API documentation
- **LINQ** - Query syntax for data operations
- **DateTimeOffset** - Timezone-aware date handling

### ✨ Key Features

* **User authentication & authorization** with ASP.NET Core Identity
* **JWT-based token authentication** for secure API access
* **Role-based access control** (Admin, Receptionist, Employee, FacilityManager)
* **Two-step booking workflow** (Pending → Confirmed by Receptionist)
* **Location and capacity tracking** for bookings
* **Session management** with validation
* **Room management** with soft-delete functionality
* **Conflict detection** preventing double-bookings
* **String-based enum serialization** for better API clarity
* **Entity Framework Core migrations** for repeatable schema evolution
* **Centralized exception handling** with custom middleware
* **Seeded test data** meeting production requirements

---

## 🆕 What Changed Recently

The project has evolved into a **production-ready API** with enterprise features:

* ✅ **ASP.NET Core Identity** with JWT authentication
* ✅ **Entity Framework Core** with SQLite database
* ✅ **Role-based authorization** (Admin, Receptionist, Employee, FacilityManager)
* ✅ **Two-step booking workflow** (Pending → Confirmed by Receptionist)
* ✅ **Session entity** with capacity validation and time ranges
* ✅ **Location and Capacity tracking** for bookings
* ✅ **Room management** with soft-delete (IsActive flag)
* ✅ **EF Core Migrations** for schema evolution (7 migrations applied)
* ✅ **Seeded test data** meeting production requirements
* ✅ **ConfirmBookingController** for receptionist workflow
* ✅ **Multiple controllers** for complete booking lifecycle
* ✅ **DTO-based request/response models**
* ✅ **Custom middleware** for exception handling
* ✅ **String-based enum serialization** for locations
* ✅ **JWT token-based authentication** for stateless API access

---

## 🧱 Solution Structure

```
ConferenceBookingDomain/
│
├── API/                        # ASP.NET Core Web API
│   ├── Controllers/
│   │   ├── AuthController.cs              # JWT login
│   │   ├── CreateBookingController.cs     # Create bookings (Pending status)
│   │   ├── ConfirmBookingController.cs    # Confirm bookings (Receptionist/Admin)
│   │   ├── UpdateBookingController.cs     # Update bookings
│   │   ├── GetAllBookingsController.cs    # List all bookings & get by ID
│   │   ├── DeleteBookingController.cs     # Admin-only delete
│   │   ├── CancelBookingController.cs     # Cancel bookings
│   │   ├── ListAllRoomsController.cs      # Get all rooms with filtering
│   │   ├── RoomManagementController.cs    # CRUD for rooms (Admin)
│   │   └── CheckAvailableRoomsController.cs # Check room availability
│   ├── Auth/
│   │   ├── ApplicationUser.cs             # Identity user
│   │   ├── IdentitySeeder.cs              # Seed users & roles
│   │   └── TokenService.cs                # JWT generation
│   ├── Data/
│   │   ├── ApplicationDbContext.cs        # EF Core DbContext with seed data
│   │   ├── BookingRepository.cs
│   │   └── ConferenceRoomRepository.cs
│   ├── DTO/
│   │   ├── CreateBookingRequestDTO.cs     # Includes Location & Capacity
│   │   ├── ConfirmBookingDTO.cs
│   │   ├── UpdateBookingDTO.cs
│   │   ├── GetAllBookingsDTO.cs
│   │   ├── CancelBookingDTO.cs
│   │   ├── DeleteBookingDTO.cs
│   │   ├── CheckAvailableRoomsDTO.cs
│   │   ├── ListAllRoomsDTO.cs
│   │   └── LoginDto.cs
│   ├── Entities/
│   │   ├── ConferenceRoom.cs              # EF Core entity (Location, IsActive)
│   │   ├── Session.cs                     # Session entity with validation
│   │   ├── BookingStatus.cs               # Enum (Pending/Confirmed/Cancelled)
│   │   └── RoomLocation.cs                # Enum with string serialization
│   ├── Middleware/
│   │   └── ExceptionHandlingMiddleware.cs
│   ├── Services/
│   │   └── BookingManager.cs              # Business logic
│   ├── Models/
│   │   ├── Booking.cs                     # EF Core entity (Location, Capacity, Timestamps)
│   │   └── BookingRecord.cs
│   ├── Exceptions/
│   │   ├── InvalidBookingException.cs
│   │   ├── BookingNotFoundException.cs
│   │   └── BookingConflictException.cs
│   ├── Migrations/                        # 7 EF Core migrations
│   │   ├── 20260210020331_InitialCreate.cs
│   │   ├── 20260210223746_AddSessionEntity.cs
│   │   ├── 20260210230955_AddBookingTimestamps.cs
│   │   ├── 20260210232212_AddRoomLocationAndIsActive.cs
│   │   ├── 20260210233700_StandardizeRoomsAcrossLocations.cs
│   │   ├── 20260211025757_AddLocationAndCapacityToBooking.cs
│   │   └── 20260211033711_SeedRequiredTestData.cs
│   └── Program.cs
│
├── Persistence-notes.md        # Documentation on persistence layer
├── Professional-Reasoning.md   # Database migration best practices
└── README.md
```

---

## 🗄️ Database Schema & Migrations

### Applied Migrations (7 total)

1. **InitialCreate** - Base schema with Bookings and ConferenceRooms tables
2. **AddSessionEntity** - Added Sessions table with capacity validation
3. **AddBookingTimestamps** - Added CreatedAt (SQL default) and CancelledAt fields
4. **AddRoomLocationAndIsActive** - Added Location enum and IsActive soft-delete flag
5. **StandardizeRoomsAcrossLocations** - Seeded 25 rooms across 5 office locations
6. **AddLocationAndCapacityToBooking** - Added Location and Capacity to bookings
7. **SeedRequiredTestData** - Seeded required test data (inactive room, session, confirmed booking)

### Seed Data Requirements Met

✅ **At least one active room** - 25 active rooms across 5 locations  
✅ **At least one inactive room** - Room 26 (Archived Meeting Room, IsActive = false)  
✅ **At least one session with valid time range** - Session 9001 (Q1 Strategy Planning Session)  
✅ **At least one booking in non-default status** - Booking 9001 (Confirmed status)

**Repeatability:** All seed data uses high IDs (9001, 26) or EF Core's HasData() to prevent duplicates on re-run.

### Database Tables

**Bookings**
- Id (PK), RoomId (FK), RequestedBy, StartTime, EndTime
- Status (Pending/Confirmed/Cancelled)
- CreatedAt (default: SQL datetime('now')), CancelledAt (nullable)
- Location (enum), Capacity (int)

**ConferenceRooms**
- Id (PK), Name, Capacity, Number
- Location (enum: London/CapeTown/Johannesburg/Bloemfontein/Durban)
- IsActive (bool, soft-delete flag)

**Sessions**
- Id (PK), RoomId (FK, nullable), Title, Description
- Capacity (validated > 0)
- StartTime, EndTime (validated: EndTime > StartTime)

**AspNetUsers** (Identity)
- Standard Identity tables for users, roles, and claims

---

## 🧩 Core Domain Concepts

### 📦 Booking (Entity)

Represents a booking request stored in the database:
* **Foreign Key**: `RoomId` links to ConferenceRoom
* **Navigation Property**: `Room` for EF Core relationship
* **Start/End Time**: DateTimeOffset for timezone-aware scheduling
* **Status**: Pending, Confirmed, or Cancelled
* **Timestamps**: CreatedAt (auto-set), CancelledAt (nullable)
* **Location**: Room location (London, CapeTown, Johannesburg, Bloemfontein, Durban)
* **Capacity**: Required capacity for the booking
* **Requester**: User who created the booking

**Booking Workflow:**
1. User creates booking → Status: `Pending`
2. Receptionist/Admin confirms → Status: `Confirmed` (room is now blocked)
3. User/Admin cancels → Status: `Cancelled` (CancelledAt timestamp set)

### 🏢 ConferenceRoom (Entity)

Represents a physical room with comprehensive details:
* **Name** (e.g., "Conference Room A")
* **Capacity** (number of people)
* **Room Number** (e.g., 101, 201)
* **Location** (enum: London, CapeTown, Johannesburg, Bloemfontein, Durban)
* **IsActive** (soft-delete flag - inactive rooms cannot be booked)
* **Seeded Data**: 26 rooms (25 active + 1 inactive for testing)

### 📅 Session (Entity)

Represents a scheduled session/meeting:
* **Title** (required)
* **Description** (optional)
* **Capacity** (must be positive)
* **StartTime & EndTime** (validated: EndTime > StartTime)
* **RoomId** (nullable foreign key to ConferenceRoom)
* **Validation**: Built-in `IsValid()` method ensures data integrity

### 📊 BookingStatus (Enum)

* `Pending` - Awaiting receptionist confirmation (default for new bookings)
* `Confirmed` - Approved by receptionist, room is blocked
* `Cancelled` - Cancelled by user or admin

### 🌍 RoomLocation (Enum)

Office locations with string serialization:
* `London` (0)
* `CapeTown` (1)
* `Johannesburg` (2)
* `Bloemfontein` (3)
* `Durban` (4)

JSON serialization uses string names ("London") instead of integers for better API clarity.

### 👤 ApplicationUser (Identity)

Extends `IdentityUser` for authentication:
* Integrated with ASP.NET Core Identity
* Supports roles: Admin, Receptionist, Employee, FacilityManager
* JWT token generation

Enums and entities guarantee that only **valid domain states** exist.

---

## 🛡 Business Rules & Validation

The system enforces rules strictly inside the domain and service layer:

**Domain Rules:**
* ❌ Cannot book an unavailable room
* ❌ Cannot create overlapping **confirmed** bookings for the same room
* ❌ Pending bookings do NOT block room availability
* ❌ Cannot confirm a booking if it would create a conflict
* ❌ Cannot book inactive rooms (IsActive = false)
* ❌ Cannot delete a non‑existent booking
* ❌ Session EndTime must be after StartTime
* ❌ Session Capacity must be positive
* ❌ Booking must specify valid location from enum
* ❌ Invalid input is rejected early with guard clauses

**Security Rules:**
* 🔒 All endpoints require JWT authentication
* 🔒 Confirming bookings requires `Receptionist` or `Admin` role
* 🔒 Deleting bookings requires `Admin` role
* 🔒 Room management (create/update/delete) requires `FacilityManager` or `Admin` role
* 🔒 Users must be logged in to create/view bookings
* 🔒 Tokens expire after 1 hour

**Workflow Rules:**
* 📋 New bookings start with `Pending` status
* ✅ Receptionist/Admin confirms → status changes to `Confirmed`
* 🚫 Only confirmed bookings block room availability
* 📅 Cancelled bookings get CancelledAt timestamp
* 🏢 Inactive rooms cannot receive new bookings

**Data Integrity:**
* ✅ Foreign key constraints enforced by database
* ✅ Database handles concurrent access safely
* ✅ Transactions ensure atomic operations
* ✅ Default SQL timestamps for CreatedAt field
* ✅ Enum-based validation for Location and Status

Guard clauses and middleware work together to **fail fast** and keep the system consistent.

---

## ⚠️ Exception Handling

### Custom Exceptions

* `InvalidBookingException` - Business rule violations
* `BookingConflictException` - Overlapping bookings
* `BookingNotFoundException` - Booking not found
* `BookingPersistenceException` - Database errors

### Middleware

All exceptions are handled centrally via **ExceptionHandlingMiddleware**:

- Converts domain exceptions to HTTP status codes (400, 404, 409, 500)
- Returns clean JSON error responses
- Prevents leaking internal details
- Logs errors for debugging
- Provides consistent error format across all endpoints

**Example Error Response:**
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

* Bookings, rooms, and sessions stored in **SQLite database** via **Entity Framework Core**
* All database operations are **asynchronous**
* `ApplicationDbContext` manages entity tracking and change detection
* **Foreign key relationships** ensure referential integrity
* **7 EF Core Migrations** track schema evolution:
  1. InitialCreate - Base schema
  2. AddSessionEntity - Session table with validation
  3. AddBookingTimestamps - CreatedAt & CancelledAt fields
  4. AddRoomLocationAndIsActive - Location enum & soft delete
  5. StandardizeRoomsAcrossLocations - 25 rooms across 5 locations
  6. AddLocationAndCapacityToBooking - Booking location/capacity tracking
  7. SeedRequiredTestData - Test data meeting requirements
* **Seeded test data** (repeatable, no duplicates):
  - 26 conference rooms (25 active + 1 inactive)
  - 1 session with valid time range
  - 1 confirmed booking (non-default status)
  - 4 user accounts with roles

**Architecture:**
```
Controllers → BookingManager → ApplicationDbContext → SQLite Database
                  ↓                      ↓
           Domain Logic           Persistence Layer
```

This design provides:
* **ACID transactions** for data consistency
* **Concurrency control** for multi-user scenarios
* **Database-agnostic** design (easy to switch to SQL Server/PostgreSQL)
* **Schema versioning** via migrations (repeatable deployments)
* **Production-ready** persistence with proper indexing and relationships

> See [Persistence-notes.md](Persistence-notes.md) for detailed explanation of the persistence architecture.
> See [Professional-Reasoning.md](Professional-Reasoning.md) for migration best practices and production considerations.

---

## 🌐 Web API Endpoints

### Authentication
| Method | Endpoint            | Description             | Auth Required |
| ------ | ------------------- | ----------------------- | ------------- |
| POST   | `/api/auth/login`   | Login & get JWT token   | No            |

### Bookings
| Method | Endpoint                        | Description                    | Auth Required | Role Required      |
| ------ | ------------------------------- | ------------------------------ | ------------- | ------------------ |
| POST   | `/api/CreateBooking/book`       | Create booking (Pending)       | Yes           | Any                |
| PATCH  | `/api/ConfirmBooking/{id}`      | Confirm booking                | Yes           | Receptionist/Admin |
| POST   | `/api/ConfirmBooking/confirm`   | Confirm booking (DTO)          | Yes           | Receptionist/Admin |
| GET    | `/api/GetAllBookings/all`       | Get all bookings               | Yes           | Any                |
| GET    | `/api/GetAllBookings/{id}`      | Get booking by ID              | Yes           | Any                |
| DELETE | `/api/CreateBooking/cancel/{id}`| Cancel booking                 | Yes           | Any                |
| DELETE | `/api/DeleteBooking/delete`     | Delete booking (hard delete)   | Yes           | Admin              |
| DELETE | `/api/CancelBooking/cancel`     | Cancel booking (soft delete)   | Yes           | Any                |

### Rooms
| Method | Endpoint                              | Description               | Auth Required | Role Required |
| ------ | ------------------------------------- | ------------------------- | ------------- | ------------- |
| GET    | `/api/ListAllRooms`                   | Get all rooms             | Yes           | Any           |
| GET    | `/api/ListAllRooms/{id}`              | Get room by ID            | Yes           | Any           |
| GET    | `/api/ListAllRooms?location=London`   | Filter rooms by location  | Yes           | Any           |
| GET    | `/api/ListAllRooms?activeOnly=true`   | Get only active rooms     | Yes           | Any           |
| POST   | `/api/RoomManagement`                 | Create new room           | Yes           | FacilityManager/Admin |
| PUT    | `/api/RoomManagement/{id}`            | Update room details       | Yes           | FacilityManager/Admin |
| PATCH  | `/api/RoomManagement/{id}/status`     | Toggle room status        | Yes           | FacilityManager/Admin |
| DELETE | `/api/RoomManagement/{id}`            | Deactivate room           | Yes           | FacilityManager/Admin |

### Availability
| Method | Endpoint                          | Description               | Auth Required |
| ------ | --------------------------------- | ------------------------- | ------------- |
| GET    | `/api/CheckAvailableRooms`        | Get available rooms       | Yes           |

### Authentication Details

**Test Users:**
- **Admin**: `admin` / `Admin@123` (Full access)
- **Receptionist**: `receptionist` / `Receptionist@123` (Can confirm bookings)
- **Employee**: `employee` / `Employee@123` (Standard user)
- **Facility Manager**: `facilitymanager` / `FacilityManager@123` (Standard user)

**JWT Token Usage:**
1. Login to get token
2. Include in requests: `Authorization: Bearer <token>`
3. Token expires after 1 hour

**Example Request:**
```json
POST /api/CreateBooking/book
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "bookingId": 100,
  "roomId": 6,
  "startDate": "2026-02-15T09:00:00Z",
  "endDate": "2026-02-15T11:00:00Z",
  "location": "CapeTown",
  "capacity": 10
}
```

Swagger/OpenAPI documentation available at `/swagger` in development mode.


---

## 🧠 Design Principles Applied

* **Clean Architecture** - Clear separation of concerns across layers
* **Domain‑Driven Design (DDD)** - Business logic encapsulated in domain
* **Migration-Based Schema Evolution** - Version-controlled database changes
* **Single Responsibility Principle** - Each class has one reason to change
* **Dependency Inversion** - Depend on abstractions (DbContext, Identity)
* **Repository Pattern** - DbContext abstracts data access
* **DTO Pattern** - API contracts separated from domain models
* **Two-Step Workflow** - Pending approval before confirmation
* **Soft Delete Pattern** - IsActive flag instead of hard deletes
* **JWT Authentication** - Stateless, scalable authentication
* **Role-Based Access Control** - Fine-grained authorization
* **Enum-Based Validation** - Type-safe status and location tracking
* **Defensive Programming** - Guard clauses and validation
* **Async/Await** - Non-blocking I/O for scalability
* **Audit Trail** - Timestamps for tracking changes

> The domain contains the rules.  
> Services coordinate.  
> Infrastructure supports.  
> Security protects.  
> Migrations evolve.

---

## 🚀 Getting Started

### Prerequisites
- .NET 8 SDK
- Visual Studio 2022 / VS Code / Rider

### Running the API

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ConferenceBookingDomain
   ```

2. **Run the application**
   ```bash
   dotnet run --project API/API.csproj
   ```

3. **Access the API**
   - API: `http://localhost:5230`
   - Swagger: `http://localhost:5230/swagger`

### Quick Test with Postman

1. **Login**
   ```
   POST http://localhost:5230/api/auth/login
   Content-Type: application/json
   
   Body: {
     "username": "admin",
     "password": "Admin@123"
   }
   ```
   Response: `{ "token": "eyJhbGc..." }`

2. **Create Booking (Pending Status)**
   ```
   POST http://localhost:5230/api/CreateBooking/book
   Authorization: Bearer <token>
   Content-Type: application/json
   
   Body: {
     "bookingId": 100,
     "roomId": 6,
     "startDate": "2026-02-15T09:00:00Z",
     "endDate": "2026-02-15T11:00:00Z",
     "location": "CapeTown",
     "capacity": 10
   }
   ```

3. **Confirm Booking (Receptionist/Admin)**
   ```
   Login as receptionist first:
   POST http://localhost:5230/api/auth/login
   Body: { "username": "receptionist", "password": "Receptionist@123" }
   
   Then confirm:
   PATCH http://localhost:5230/api/ConfirmBooking/100
   Authorization: Bearer <receptionist-token>
   ```

4. **Get All Rooms**
   ```
   GET http://localhost:5230/api/ListAllRooms
   Authorization: Bearer <token>
   ```

5. **Get All Bookings**
   ```
   GET http://localhost:5230/api/GetAllBookings/all
   Authorization: Bearer <token>
   ```

---

## 🚀 Possible Next Steps

* ✅ ~~Replace JSON with a database~~ **DONE - Using EF Core + SQLite**
* ✅ ~~Add authentication & authorization~~ **DONE - JWT + Identity**
* ✅ ~~Add room capacity & location tracking~~ **DONE - Location enum + Capacity field**
* ✅ ~~Add session entity with time validation~~ **DONE - Session with StartTime/EndTime**
* ✅ ~~Add booking workflow (Pending → Confirmed)~~ **DONE - Receptionist confirmation**
* ✅ ~~Add room management (soft delete)~~ **DONE - IsActive flag**
* ✅ ~~Add timestamps for audit trail~~ **DONE - CreatedAt, CancelledAt**
* Add calendar integration (Google Calendar, Outlook)
* Implement recurring bookings
* Add email notifications for booking confirmations
* Build a frontend UI (React/Angular/Vue)
* Add comprehensive unit & integration tests
* Implement caching for performance (Redis)
* Add audit logging for compliance
* Add reporting and analytics dashboard
* Deploy to cloud (Azure/AWS)
* Add real-time notifications (SignalR)
* Implement multi-tenancy support

---

## ✍️ Author

**TJ Gaba**
