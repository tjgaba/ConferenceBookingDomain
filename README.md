
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
* [Possible Next Steps](#-possible-next-steps)
* [Author](#-author)

---

## 📌 Overview

This repository contains a **Conference Room Booking System** built with **.NET 8**, following clean architecture and domain‑driven design principles.
The solution is split into a **pure domain layer** and an **ASP.NET Core Web API** that exposes booking functionality via HTTP endpoints.

The system supports:

* Creating bookings
* Preventing booking conflicts
* Viewing all bookings
* Deleting bookings
* Persisting data using JSON file storage
* Centralized exception handling

---

## 🆕 What Changed Recently

The project has evolved beyond a simple domain demo and now includes:

* ✅ **Fully functional ASP.NET Core Web API**
* ✅ **Multiple controllers** for booking lifecycle operations
* ✅ **DTO-based request/response models**
* ✅ **File‑based persistence using JSON**
* ✅ **Custom middleware for exception handling**
* ✅ **Clear separation between domain, services, persistence, and API layers**

---

## 🧱 Solution Structure

```
ConferenceBookingDomain/
│
├── API/                        # ASP.NET Core Web API
│   ├── Controllers/
│   │   ├── BookingController.cs
│   │   ├── GetAllBookingsController.cs
│   │   └── DeleteBookingController.cs
│   ├── DTO/
│   │   ├── CreateBookingRequestDTO.cs
│   │   ├── GetAllBookingsDTO.cs
│   │   └── DeleteBookingDTO.cs
│   ├── Middleware/
│   │   └── ExceptionHandlingMiddleware.cs
│   ├── Services/
│   │   └── BookingManager.cs
│   ├── Persistence/
│   │   └── BookingFileStore.cs
│   ├── Data/
│   │   └── bookings.json
│   └── Program.cs
│
├── Domain/
│   ├── Models/
│   │   ├── Booking.cs
│   │   └── BookingRecord.cs
│   ├── Entities/
│   │   ├── ConferenceRoom.cs
│   │   └── BookingStatus.cs
│   ├── Interfaces/
│   │   └── IBookingStore.cs
│   ├── Exceptions/
│   │   ├── InvalidBookingException.cs
│   │   ├── BookingNotFoundException.cs
│   │   └── BookingConflictException.cs
│   └── Domain/RoomAvailability.cs
│
├── Persistence/
│   ├── BookingFileStore.cs
│   └── BookingPersistenceException.cs
│
├── service/
│   ├── BookRoomHandler.cs
│   └── ViewAvailabilityHandler.cs
│
├── Data/
│   └── bookings.json
│
└── README.md
```

---

## 🧩 Core Domain Concepts

### 📦 Booking

Represents a booking request including:

* Date & time
* Assigned conference room
* Booking status

### 🏢 ConferenceRoom

Represents a physical room with availability rules.

### 📊 BookingStatus (Enum)

* Pending
* Confirmed
* Cancelled

### 📅 RoomAvailability (Enum)

* Available
* Unavailable

Enums guarantee that only **valid domain states** exist.

---

## 🛡 Business Rules & Validation

The system enforces rules strictly inside the domain and service layer:

* ❌ Cannot book an unavailable room
* ❌ Cannot delete a non‑existent booking
* ❌ Cannot create overlapping bookings
* ❌ Invalid input is rejected early


Guard clauses are used to **fail fast** and keep the domain consistent.

---

## ⚠️ Exception Handling

### Custom Exceptions

* `InvalidBookingException`
* `BookingConflictException`
* `BookingNotFoundException`
* `BookingPersistenceException`

### Middleware

All exceptions are handled centrally via:

```
ExceptionHandlingMiddleware
```

Which:

* Converts domain exceptions to HTTP status codes
* Returns clean JSON error responses
* Prevents leaking internal details

---

## 💾 Persistence Strategy

* Bookings are stored in **JSON files**
* All file operations are **asynchronous**
* Persistence is isolated behind `IBookingStore`

This design allows easy replacement with:

* SQL database
* NoSQL store
* Cloud storage

---

## 🌐 Web API Endpoints

| Method | Endpoint       | Description           |
| ------ | -------------- | --------------------- |
| POST   | `/booking`     | Create a booking      |
| GET    | `/booking/all` | Retrieve all bookings |
| DELETE | `/booking`     | Delete a booking      |

Swagger is enabled in development for easy testing.


---

## 🧠 Design Principles Applied

* Clean Architecture
* Domain‑Driven Design (DDD)
* Single Responsibility Principle
* Dependency Inversion
* Defensive programming
* Explicit business rules

> The domain contains the rules.
> Services coordinate.
> Infrastructure supports.

---

## 🚀 Possible Next Steps

* Replace JSON with a database
* Add authentication & authorization
* Introduce room capacity & scheduling windows
* Add unit & integration tests
* Build a frontend UI

---

## ✍️ Author

**TJ Gaba**
