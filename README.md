
# 🏢 Conference Room Booking System (Domain + API)

## 📚 Table of Contents

* [Overview](#-overview)
* [Changes](#-what-changed-recently)
* [Solution Structure](#-solution-structure)
* [Database Schema & Migrations](#-database-schema--migrations)
* [Core Domain Concepts](#-core-domain-concepts)
* [Business Rules & Validation](#-business-rules--validation)
* [Exception Handling](#-exception-handling)
* [Persistence Strategy](#-persistence-strategy)
* [Backend Readiness Review](#-backend-readiness-review)
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
- **PostgreSQL** - Relational database (via Docker)
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
* ✅ **Entity Framework Core** with PostgreSQL database
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
* ✅ **Resilient React frontend** connected via centralized Axios singleton with interceptors, AbortController, and four-path error discrimination

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

* Bookings, rooms, and sessions stored in **PostgreSQL database** via **Entity Framework Core**
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
Controllers → BookingManager → ApplicationDbContext → PostgreSQL Database
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
> >See [Professional-Reasoning.md](Professional-Reasoning.md) for migration best practices and production considerations.

---

## 🏗️ Backend Readiness Review

This section explains the architectural decisions that make this API production-ready and frontend-friendly.

### Entity Relationships & Data Model �️ Backend Readiness Review

This section explains the architectural decisions that make this API production-ready and frontend-friendly.

### Entity Relationships & Data Model

The system implements a carefully designed relational model that ensures referential integrity while maintaining flexibility for future growth. At the core of the system are three primary entities with well-defined relationships.

#### Primary Relationships

**Booking → ConferenceRoom** (Many-to-One)
```csharp
public class Booking
{
    public int RoomId { get; set; }           // Foreign key
    public ConferenceRoom Room { get; set; }  // Navigation property
}
```
- **Relationship Type**: Multiple bookings can reference a single room
- **Cascade Behavior**: `OnDelete: Restrict` - prevents accidental deletion of rooms with bookings
- **Purpose**: Ensures every booking is linked to a valid room
- **Enforcement**: Database foreign key constraint + EF Core navigation property

**Booking → ApplicationUser** (Many-to-One)
```csharp
public class Booking
{
    public string UserId { get; set; }        // Foreign key
    public ApplicationUser User { get; set; } // Navigation property
}
```
- **Relationship Type**: Multiple bookings can be created by a single user
- **Cascade Behavior**: `OnDelete: Restrict` - preserves booking history when users are deactivated
- **Purpose**: Tracks who created each booking for audit and authorization
- **Enforcement**: Database foreign key constraint + ASP.NET Core Identity

**Session → ConferenceRoom** (Many-to-One, Optional)
```csharp
public class Session
{
    public int? RoomId { get; set; }          // Nullable foreign key
    public ConferenceRoom? Room { get; set; } // Optional navigation
}
```
- **Relationship Type**: Sessions can optionally be assigned to a room
- **Purpose**: Links recurring or scheduled sessions to specific rooms
- **Enforcement**: Nullable foreign key allows sessions without room assignments

#### Relationship Diagram

```
ApplicationUser (ASP.NET Identity)
    ↓ 1:Many
Booking ←→ ConferenceRoom
    ↑ Many:1     ↑ 1:Many (optional)
    Session
```

**Key Benefits:**
- **Referential Integrity**: Cannot create bookings for non-existent rooms or users
- **Orphan Prevention**: Cascade rules prevent data inconsistencies
- **Audit Trail**: User relationships track booking ownership
- **Query Efficiency**: Navigation properties enable efficient joins via `Include()`

### Soft Delete Implementation

The system implements soft delete for **ConferenceRoom** and **ApplicationUser** entities to preserve historical data and maintain referential integrity for existing bookings.

#### Why Soft Delete?

Physical deletion of rooms or users would violate foreign key constraints for existing bookings, creating orphaned records and breaking the audit trail. Soft delete solves this by marking entities as inactive rather than removing them from the database.

#### Implementation Details

**ConferenceRoom Soft Delete:**
```csharp
public class ConferenceRoom
{
    public bool IsActive { get; set; } = true;       // Status flag
    public DateTimeOffset? DeletedAt { get; set; }   // Audit timestamp
}
```

**ApplicationUser Soft Delete:**
```csharp
public class ApplicationUser : IdentityUser
{
    public bool IsActive { get; set; } = true;       // Status flag
    public DateTimeOffset? DeletedAt { get; set; }   // Audit timestamp
}
```

#### Business Rules for Soft Delete

| Entity | Can Be Booked? | Appears in Lists? | Can Be Restored? | Cascade Effect |
|--------|----------------|-------------------|------------------|----------------|
| **Inactive Room** | ❌ No | ❌ No (filtered) | ✅ Yes | Existing bookings remain valid |
| **Inactive User** | ❌ No | ❌ No (filtered) | ✅ Yes | Past bookings preserved in history |

**Query-Level Filtering:**
```csharp
// Rooms are filtered by default to exclude deleted records
var activeRooms = await _dbContext.ConferenceRooms
    .Where(r => r.IsActive == true)
    .AsNoTracking()
    .ToListAsync();

// Bookings only show for active rooms
var bookings = await _dbContext.Bookings
    .Include(b => b.Room)
    .Where(b => b.Room.IsActive == true)
    .ToListAsync();
```

**Deactivation vs Reactivation:**
```csharp
// Deactivate room (soft delete)
room.IsActive = false;
room.DeletedAt = DateTimeOffset.UtcNow;  // Audit trail

// Reactivate room
room.IsActive = true;
room.DeletedAt = null;  // Clear deletion timestamp
```

**Benefits:**
- ✅ Preserves historical booking data
- ✅ Maintains referential integrity
- ✅ Enables data recovery if needed
- ✅ Provides audit trail with deletion timestamps
- ✅ Prevents "cascade delete" disasters

### Data Integrity Enforcement

The system enforces data integrity through multiple layers of defense, ensuring consistency from the database layer through the application layer.

#### Layer 1: Database Constraints

**Foreign Key Constraints:**
```sql
-- Booking → ConferenceRoom (required)
FOREIGN KEY (RoomId) REFERENCES ConferenceRooms(Id) ON DELETE RESTRICT

-- Booking → ApplicationUser (required)
FOREIGN KEY (UserId) REFERENCES AspNetUsers(Id) ON DELETE RESTRICT

-- Session → ConferenceRoom (optional)
FOREIGN KEY (RoomId) REFERENCES ConferenceRooms(Id) ON DELETE SET NULL
```

**Benefits**: Database-level enforcement prevents invalid references even if application logic fails.

#### Layer 2: Service Layer Validation

All domain rules are centralized in **BookingValidationService** to ensure consistency across the API:

```csharp
public class BookingValidationService
{
    // 1. Prevent booking inactive/deleted rooms
    public async Task<(bool, string?, ConferenceRoom?)> ValidateRoomAvailabilityAsync(int roomId)
    {
        var room = await _dbContext.ConferenceRooms.FindAsync(roomId);
        if (room == null)
            return (false, "Room not found.", null);
        
        if (!room.IsActive)
            return (false, "This room is not currently available for booking.", null);
        
        return (true, null, room);
    }

    // 2. Prevent double bookings
    public async Task<bool> ValidateNoDoubleBookingAsync(...)
    {
        var conflictingBookings = await _dbContext.Bookings
            .Where(b => b.RoomId == roomId && 
                       b.Id != excludeBookingId &&
                       b.Status == BookingStatus.Confirmed)
            .AnyAsync(b => b.EndTime > startTime && b.StartTime < endTime);
        
        return !conflictingBookings;
    }

    // 3. Enforce business hours (08:00 - 16:00)
    public bool ValidateBusinessHours(DateTimeOffset startTime, DateTimeOffset endTime)
    {
        const int BusinessHoursStart = 8;
        const int BusinessHoursEnd = 16;
        
        return startTime.Hour >= BusinessHoursStart && 
               endTime.Hour <= BusinessHoursEnd;
    }
    
    // 4. Additional validations: date range, same-day, capacity
}
```

**Enforced Domain Rules:**
- ❌ Cannot book inactive rooms
- ❌ Cannot create double bookings (overlapping confirmed bookings)
- ❌ Bookings must be within business hours (08:00 AM - 4:00 PM)
- ❌ Start time must be before end time
- ❌ Bookings must be on the same day (no multi-day reservations)
- ❌ Requested capacity cannot exceed room capacity

#### Layer 3: Query Discipline

All list endpoints implement production-ready query patterns:

**1. Database-Level Projection (No Over-Fetching):**
```csharp
var bookings = await _dbContext.Bookings
    .Where(b => b.Room.IsActive == true)
    .Select(b => new BookingSummaryDTO
    {
        Id = b.Id,
        RoomName = b.Room.Name,
        StartTime = b.StartTime,
        // Only fields needed by frontend
    })
    .ToListAsync();
```

**2. Pagination (Prevents Performance Issues):**
```csharp
var rooms = await _dbContext.ConferenceRooms
    .Where(r => r.IsActive == true)
    .Skip((page - 1) * pageSize)
    .Take(pageSize)
    .ToListAsync();
```

**3. AsNoTracking (Read-Only Performance):**
```csharp
var rooms = await _dbContext.ConferenceRooms
    .AsNoTracking()  // Improves read performance
    .Where(r => r.IsActive)
    .ToListAsync();
```

**Benefits:**
- ✅ Prevents N+1 query problems
- ✅ Reduces network payload size
- ✅ Improves API response times
- ✅ Handles large datasets gracefully
- ✅ Filters inactive data by default

### Frontend Support Features

The API is designed with frontend development in mind, providing a developer-friendly interface with predictable behavior.

#### 1. Consistent Response Format

All endpoints return standardized responses with pagination metadata:

```csharp
public class PaginatedResponseDTO<T>
{
    public int TotalCount { get; set; }      // Total records (for pagination UI)
    public int Page { get; set; }            // Current page number
    public int PageSize { get; set; }        // Records per page
    public int TotalPages { get; set; }      // Calculated total pages
    public List<T> Data { get; set; }        // Actual data
}
```

**Example Response:**
```json
{
  "totalCount": 142,
  "page": 2,
  "pageSize": 20,
  "totalPages": 8,
  "data": [
    { "id": 21, "roomName": "Conference Room A", ... },
    { "id": 22, "roomName": "Board Room", ... }
  ]
}
```

**Benefits for Frontend:**
- ✅ Easy to build pagination controls (Next/Previous buttons)
- ✅ Progress indicators ("Showing 21-40 of 142")
- ✅ Predictable structure across all endpoints
- ✅ No need to fetch all data to count records

#### 2. DTO-Based Responses (No Entity Exposure)

Frontend receives clean, purpose-built DTOs instead of raw database entities:

```csharp
// ❌ BAD: Exposing internal entity
public ConferenceRoom GetRoom(int id)  // Includes EF tracking, nav properties

// ✅ GOOD: Clean DTO for frontend
public RoomDetailDTO GetRoom(int id)   // Only fields frontend needs
{
    return new RoomDetailDTO
    {
        Id = room.Id,
        Name = room.Name,
        Capacity = room.Capacity,
        Location = room.Location.ToString(),  // Enum → string
        // No: IsActive, DeletedAt, Navigation properties
    };
}
```

**Benefits:**
- ✅ Prevents accidental exposure of sensitive fields
- ✅ Reduces JSON payload size (no circular references)
- ✅ Frontend-friendly naming conventions
- ✅ Version stability (entity changes don't break API)

#### 3. String-Based Enum Serialization

Enums are serialized as strings instead of integers for better readability:

```json
{
  "location": "London",        // ✅ Human-readable
  "status": "Confirmed"        // ✅ Self-documenting
}

// Instead of:
{
  "location": 0,               // ❌ Requires lookup table
  "status": 1                  // ❌ Magic numbers
}
```

**Configuration:**
```csharp
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(
            new JsonStringEnumConverter());
    });
```

#### 4. Sorting & Filtering Support

Endpoints support query parameters for flexible data retrieval:

```http
# Sort by room name, page 2
GET /api/booking/all?page=2&pageSize=10&sortBy=RoomName&sortOrder=asc

# Filter by location
GET /api/rooms?location=London&activeOnly=true

# Filter bookings by date range
GET /api/booking/filter?startDate=2026-02-15&endDate=2026-02-20
```

**Benefits:**
- ✅ Frontend controls sorting without client-side logic
- ✅ Reduces network traffic (filter at source)
- ✅ Supports advanced search UIs
- ✅ Consistent query parameter naming

#### 5. Comprehensive Error Handling

Centralized middleware provides clean, actionable error messages:

```json
// Validation error (400)
{
  "success": false,
  "error": {
    "message": "Start time must be before end time.",
    "statusCode": 400
  }
}

// Conflict error (409)
{
  "success": false,
  "error": {
    "message": "Room is not available during the requested time.",
    "statusCode": 409
  }
}
```

**HTTP Status Codes:**
- `200 OK` - Successful operation
- `400 Bad Request` - Validation failure (client error)
- `401 Unauthorized` - Missing/invalid JWT token
- `403 Forbidden` - Insufficient permissions (wrong role)
- `404 Not Found` - Resource doesn't exist
- `409 Conflict` - Business rule violation (double booking)
- `500 Internal Server Error` - Unexpected server error

**Benefits:**
- ✅ Frontend can distinguish between error types
- ✅ User-friendly error messages (no stack traces)
- ✅ Consistent error structure across all endpoints
- ✅ Easy to display in UI notifications

#### 6. JWT Authentication for Stateless Sessions

Token-based authentication eliminates server-side session storage:

```http
POST /api/auth/login
{
  "username": "admin@example.com",
  "password": "Admin@123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiration": "2026-02-15T15:30:00Z",
  "username": "admin@example.com",
  "roles": ["Admin"]
}
```

**Usage in Frontend:**
```javascript
// Store token
localStorage.setItem('token', response.token);

// Include in requests
fetch('/api/booking/all', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

**Benefits:**
- ✅ Scalable (no server-side session state)
- ✅ Works across multiple servers (load balancing)
- ✅ Mobile-friendly (token storage)
- ✅ Automatic expiration (security)

#### Summary: Why This API is Frontend-Ready

| Feature | Benefit | Example |
|---------|---------|---------|
| **Pagination** | Handles large datasets | `?page=2&pageSize=20` |
| **Sorting** | Client controls order | `?sortBy=RoomName&sortOrder=asc` |
| **Filtering** | Reduces network traffic | `?location=London&activeOnly=true` |
| **DTOs** | Clean, predictable responses | No circular refs, no over-fetching |
| **String Enums** | Human-readable values | `"status": "Confirmed"` |
| **Error Handling** | Actionable error messages | `400` vs `409` vs `500` |
| **JWT Auth** | Stateless, scalable | Token in `Authorization` header |
| **Metadata** | Rich pagination info | `totalCount`, `totalPages` for UI |

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

* ✅ ~~Replace JSON with a database~~ **DONE - Using EF Core + PostgreSQL**
* ✅ ~~Add authentication & authorization~~ **DONE - JWT + Identity**
* ✅ ~~Add room capacity & location tracking~~ **DONE - Location enum + Capacity field**
* ✅ ~~Add session entity with time validation~~ **DONE - Session with StartTime/EndTime**
* ✅ ~~Add booking workflow (Pending → Confirmed)~~ **DONE - Receptionist confirmation**
* ✅ ~~Add room management (soft delete)~~ **DONE - IsActive flag**
* ✅ ~~Add timestamps for audit trail~~ **DONE - CreatedAt, CancelledAt**
* ✅ ~~Build a frontend UI~~ **DONE - React 19 + Vite 7 frontend with Axios resilient client**
* Add calendar integration (Google Calendar, Outlook)
* Implement recurring bookings
* Add email notifications for booking confirmations
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
