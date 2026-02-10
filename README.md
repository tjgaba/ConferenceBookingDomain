
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
- **Entity Framework Core** - ORM for database access
- **SQLite** - Lightweight development database
- **ASP.NET Core Identity** - User authentication & authorization
- **JWT (JSON Web Tokens)** - Stateless authentication
- **Swagger/OpenAPI** - API documentation
- **LINQ** - Query syntax for data operations

### ✨ Key Features

* **User authentication & authorization** with ASP.NET Core Identity
* **JWT-based token authentication** for secure API access
* **Role-based access control** (Admin, Receptionist, FacilityManager, Employee)
* Creating and managing bookings with conflict detection
* Viewing all bookings and available rooms
* Deleting and canceling bookings (role-restricted)
* **Entity Framework Core** with SQLite database
* Centralized exception handling
* **Seeded test data** for rooms and users

---

## 🆕 What Changed Recently

The project has evolved into a **production-ready API** with enterprise features:

* ✅ **ASP.NET Core Identity** with JWT authentication
* ✅ **Entity Framework Core** with SQLite database
* ✅ **Role-based authorization** (Admin, Receptionist, FacilityManager, Employee)
* ✅ **DbContext** with proper foreign key relationships
* ✅ **Seeded conference rooms** and user accounts
* ✅ **Multiple controllers** for complete booking lifecycle
* ✅ **DTO-based request/response models**
* ✅ **Custom middleware** for exception handling
* ✅ **Clear separation** between domain, services, persistence, and API layers
* ✅ **JWT token-based authentication** for stateless API access

---

## 🧱 Solution Structure

```
ConferenceBookingDomain/
│
├── API/                        # ASP.NET Core Web API
│   ├── Controllers/
│   │   ├── AuthController.cs              # JWT login
│   │   ├── CreateBookingController.cs     # Create bookings
│   │   ├── UpdateBookingController.cs     # Update bookings
│   │   ├── GetAllBookingsController.cs    # List all bookings
│   │   ├── DeleteBookingController.cs     # Admin-only delete
│   │   ├── CancelBookingController.cs     # Cancel bookings
│   │   ├── ListAllRoomsController.cs      # Get all rooms
│   │   └── CheckAvailableRoomsController.cs # Check room availability
│   ├── Auth/
│   │   ├── ApplicationUser.cs             # Identity user
│   │   ├── IdentitySeeder.cs              # Seed users & roles
│   │   └── TokenService.cs                # JWT generation
│   ├── Data/
│   │   └── ApplicationDbContext.cs        # EF Core DbContext
│   ├── DTO/
│   │   ├── CreateBookingRequestDTO.cs
│   │   ├── UpdateBookingDTO.cs
│   │   ├── GetAllBookingsDTO.cs
│   │   ├── CancelBookingDTO.cs
│   │   ├── DeleteBookingDTO.cs
│   │   ├── CheckAvailableRoomsDTO.cs
│   │   ├── ListAllRoomsDTO.cs
│   │   └── LoginDto.cs
│   ├── Middleware/
│   │   └── ExceptionHandlingMiddleware.cs
│   ├── Services/
│   │   └── BookingManager.cs              # Business logic
│   ├── Models/
│   │   ├── Booking.cs                     # EF Core entity
│   │   └── BookingRecord.cs
│   ├── Entities/
│   │   ├── ConferenceRoom.cs              # EF Core entity
│   │   └── BookingStatus.cs               # Enum
│   ├── Exceptions/
│   │   ├── InvalidBookingException.cs
│   │   ├── BookingNotFoundException.cs
│   │   └── BookingConflictException.cs
│   ├── Migrations/                        # EF Core migrations
│   └── Program.cs
│
├── Persistence-notes.md        # Documentation on persistence layer
└── README.md
```

---

## 🧩 Core Domain Concepts

### 📦 Booking (Entity)

Represents a booking request stored in the database:
* **Foreign Key**: `RoomId` links to ConferenceRoom
* **Navigation Property**: `Room` for EF Core relationship
* Date & time (start/end)
* Requester information
* Booking status

### 🏢 ConferenceRoom (Entity)

Represents a physical room with seeded test data:
* Name (e.g., "Conference Room A")
* Capacity
* Room number
* Pre-seeded with 5 rooms for testing

### 📊 BookingStatus (Enum)

* `Pending` - Awaiting confirmation
* `Confirmed` - Active booking
* `Cancelled` - Cancelled by user

### 👤 ApplicationUser (Identity)

Extends `IdentityUser` for authentication:
* Integrated with ASP.NET Core Identity
* Supports roles and claims
* JWT token generation

Enums and entities guarantee that only **valid domain states** exist.

---

## 🛡 Business Rules & Validation

The system enforces rules strictly inside the domain and service layer:

**Domain Rules:**
* ❌ Cannot book an unavailable room
* ❌ Cannot create overlapping bookings for the same room
* ❌ Cannot delete a non‑existent booking
* ❌ Invalid input is rejected early with guard clauses

**Security Rules:**
* 🔒 All endpoints require JWT authentication
* 🔒 Deleting bookings requires `Admin` role
* 🔒 Users must be logged in to create/view bookings
* 🔒 Tokens expire after 1 hour

**Data Integrity:**
* ✅ Foreign key constraints enforced by database
* ✅ Database handles concurrent access safely
* ✅ Transactions ensure atomic operations

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

* Bookings and rooms are stored in **SQLite database** via **Entity Framework Core**
* All database operations are **asynchronous**
* `ApplicationDbContext` manages entity tracking and change detection
* **Foreign key relationships** ensure referential integrity
* **Seeded data** for rooms and users on first run
* Database schema managed through **EF Core Migrations**

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
* **Production-ready** persistence with proper indexing and relationships

> See [Persistence-notes.md](Persistence-notes.md) for detailed explanation of the persistence architecture.

---

## 🌐 Web API Endpoints

### Authentication
| Method | Endpoint            | Description             | Auth Required |
| ------ | ------------------- | ----------------------- | ------------- |
| POST   | `/api/auth/login`   | Login & get JWT token   | No            |

### Bookings
| Method | Endpoint                      | Description           | Auth Required | Role Required |
| ------ | ----------------------------- | --------------------- | ------------- | ------------- |
| POST   | `/api/booking/book`           | Create a booking      | Yes           | Any           |
| GET    | `/api/getAllBookings/all`     | Get all bookings      | Yes           | Any           |
| DELETE | `/api/booking/cancel/{id}`    | Cancel booking        | Yes           | Any           |
| DELETE | `/api/deleteBooking/delete`   | Delete booking        | Yes           | Admin         |
| DELETE | `/api/cancelBooking/cancel`   | Cancel booking        | Yes           | Any           |

### Rooms
| Method | Endpoint                          | Description               | Auth Required |
| ------ | --------------------------------- | ------------------------- | ------------- |
| GET    | `/api/rooms`                      | Get all rooms             | Yes           |
| GET    | `/api/rooms/{id}`                 | Get room by ID            | Yes           |
| GET    | `/api/availableRoomsByTime`       | Get available rooms       | Yes           |
| GET    | `/api/availabilityByRoomNumber`   | Check room availability   | Yes           |

### Authentication Details

**Test Users:**
- **Admin**: `Admin` / `Admin123!` (Full access)
- **Receptionist**: `ReceptionistUser` / `Receptionist123!`
- **Facility Manager**: `FacilityManagerUser` / `FacilityManager123!`
- **Employee**: `EmployeeUser` / `Employee123!`

**JWT Token Usage:**
1. Login to get token
2. Include in requests: `Authorization: Bearer <token>`

Swagger/OpenAPI documentation available at `/swagger` in development mode.


---

## 🧠 Design Principles Applied

* **Clean Architecture** - Clear separation of concerns across layers
* **Domain‑Driven Design (DDD)** - Business logic encapsulated in domain
* **Single Responsibility Principle** - Each class has one reason to change
* **Dependency Inversion** - Depend on abstractions (DbContext, Identity)
* **Repository Pattern** - DbContext abstracts data access
* **DTO Pattern** - API contracts separated from domain models
* **JWT Authentication** - Stateless, scalable authentication
* **Role-Based Access Control** - Fine-grained authorization
* **Defensive programming** - Guard clauses and validation
* **Async/Await** - Non-blocking I/O for scalability

> The domain contains the rules.
> Services coordinate.
> Infrastructure supports.
> Security protects.

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
   Body: { "username": "Admin", "password": "Admin123!" }
   ```

2. **Create Booking**
   ```
   POST http://localhost:5230/api/booking/book
   Headers: Authorization: Bearer <token>
   Body: {
     "bookingId": 1,
     "roomId": 1,
     "startDate": "2026-02-11T09:00:00Z",
     "endDate": "2026-02-11T10:00:00Z"
   }
   ```

3. **Get All Rooms**
   ```
   GET http://localhost:5230/api/rooms
   Headers: Authorization: Bearer <token>
   ```

---

## 🚀 Possible Next Steps

* ✅ ~~Replace JSON with a database~~ **DONE - Using EF Core + SQLite**
* ✅ ~~Add authentication & authorization~~ **DONE - JWT + Identity**
* Add room capacity & scheduling windows
* Add calendar integration
* Implement recurring bookings
* Add email notifications
* Build a frontend UI (React/Angular/Vue)
* Add unit & integration tests
* Implement caching for performance
* Add audit logging
* Deploy to cloud (Azure/AWS)

---

## ✍️ Author

**TJ Gaba**
