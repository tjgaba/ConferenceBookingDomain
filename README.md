# 🏢 Conference Room Booking Domain & API

## 🌐 Recent Updates
- **Dynamic Room Selection**: The `BookingController` now dynamically fetches available rooms instead of using hardcoded values.
- **Debugging Logs**: Added logs in `BookingManager` to verify room initialization.
- **Improved Exception Handling**: Enhanced middleware to handle domain-specific exceptions consistently.

---

## 📑 Table of Contents
- [📌 Project Overview](#-project-overview)
- [🎯 Objectives](#-objectives)
- [🧱 Solution Structure](#-solution-structure)
- [🧩 Domain Concepts](#-domain-concepts)
- [🛡 Guard Clauses & Defensive Logic](#-guard-clauses--defensive-logic)
- [⚠️ Exception Handling Strategy](#️-exception-handling-strategy)
- [📦 Collection & LINQ Safety](#-collection--linq-safety)
- [💾 Asynchronous File Persistence](#-asynchronous-file-persistence)
- [🌐 ASP.NET Core Web API](#-aspnet-core-web-api)
- [🧠 Design Principles Applied](#-design-principles-applied)
- [🚀 Future Extensions](#-future-extensions)
- [✍️ Author](#️-author)

---

## 📌 Project Overview
This project models the **core domain and application behaviour** of a Conference Room Booking System using C#.

The solution demonstrates:
- Clean domain modelling
- Defensive programming
- Explicit business rule enforcement
- Safe collection handling
- Asynchronous file persistence
- Proper layering with an ASP.NET Core Web API

The system is designed so the **domain layer remains reusable and unchanged** while different application hosts (console app, Web API) coordinate its use.

---

## 🎯 Objectives
The primary goals of this project are to:

- Model real-world booking concepts accurately
- Enforce business rules through code structure
- Prevent invalid states and unsafe operations
- Demonstrate correct exception handling strategies
- Persist and retrieve booking data asynchronously
- Expose domain functionality through a Web API without leaking business logic

---

## 🧱 Solution Structure
```
ConferenceBookingDomain/
│
├── Domain/
│ ├── ConferenceRoom.cs
│ ├── Booking.cs
│ ├── BookingStatus.cs
│ ├── RoomAvailability.cs
│ ├── Exceptions/
│ │ ├── InvalidBookingException.cs
│ │ └── BookingPersistenceException.cs
│
├── Application/
│ ├── BookingService.cs
│ ├── BookRoomHandler.cs
│ ├── BookingFileStore.cs
│
├── ConsoleApp/
│ └── Program.cs
│
├── Api/
│ ├── Controllers/
│ │ └── BookingController.cs
│ ├── Program.cs
│ └── Api.csproj
│
└── README.md
```

---

## 🧩 Domain Concepts

### Core Entities
- **ConferenceRoom**  
  Represents a physical room with capacity and availability constraints.

- **Booking**  
  Represents a booking request and its lifecycle.

### Enums (Business Rules)
- **BookingStatus**
  - Pending
  - Confirmed
  - Cancelled

- **RoomAvailability**
  - Available
  - Unavailable

Enums are used to ensure only **valid states** exist within the system.

---

## 🛡 Guard Clauses & Defensive Logic
The system uses **guard clauses** to immediately reject invalid operations.

### Examples:
- Prevent booking an unavailable room
- Prevent confirming an already confirmed booking
- Prevent operations on empty collections
- Prevent invalid state transitions

Guard clauses ensure:
- Invalid actions fail fast
- The domain never enters an inconsistent state

---

## ⚠️ Exception Handling Strategy

### Custom Domain Exceptions
- **InvalidBookingException**  
  Thrown when a booking violates domain rules or no rooms are available.

- **BookingPersistenceException**  
  Thrown when file I/O operations fail.

### Exception Design Principles
- Middleware ensures consistent error responses.
- Logs provide detailed debugging information.
- Exceptions are not used for control flow.

---

## 📦 Collection & LINQ Safety
The system safely handles:
- Empty collections
- Missing data
- Failed lookups

---

## 💾 Asynchronous File Persistence
Booking data is persisted using **asynchronous file operations**.

### Capabilities:
- Save bookings asynchronously
- Load bookings asynchronously
- Correct use of `async` / `await`
- Safe handling of I/O failures

File persistence is isolated from the domain and handled in the application layer.

---

## 🌐 ASP.NET Core Web API

### Web API Enhancements

#### 1️⃣ Dynamic Room Selection
- The `POST /book` endpoint dynamically selects an available room for booking.
- Throws `InvalidBookingException` if no rooms are available.

#### 2️⃣ Debugging Logs
- Logs added to `BookingManager` to verify room initialization during startup.

#### 3️⃣ Exception Handling Middleware
- Centralized middleware maps domain exceptions to HTTP status codes.
- Ensures consistent JSON error responses.

---

## 🧠 Design Principles Applied
- Domain-first design
- Explicit rule enforcement
- Clear separation of concerns
- Defensive programming
- Fail-fast error handling
- Infrastructure kept outside the domain

> The domain defines what is allowed and forbidden.  
> Applications coordinate.  
> Infrastructure supports.

---

## 🚀 Future Extensions
This project is intentionally structured to support future enhancements such as:
- Database persistence
- Authentication and authorization
- Advanced availability rules
- Frontend integrations
- Reporting and analytics

---

## ✍️ Author
**TJ Gaba**