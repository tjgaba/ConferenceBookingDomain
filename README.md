# 🏢 Conference Room Booking System

## 📑 Table of Contents

- [📌 Project Purpose](#-project-purpose)
- [🚀 What the Project Does](#-what-the-project-does)
- [🧠 Architectural Overview](#-architectural-overview)
- [🗂 Repository Structure](#-repository-structure)
- [⚙️ Installation & Running the Project](#️-installation--running-the-project)
- [🧩 Domain & Business Rules](#-domain--business-rules)
- [📚 Project Scope](#-project-scope)
- [📄 License](#-license)
- [✍️ Author](#️-author)

---

## 📌 Project Purpose

This repository contains a **working Conference Room Booking System** implemented as a **console application**, with a strong emphasis on:

- Clear domain modelling
- Explicit business rules
- Separation of concerns
- Intentional use of collections and LINQ

The project has evolved from a static domain model into a system that **accepts booking requests, evaluates them against existing data, and enforces real-world booking constraints at runtime**.

---

## 🚀 What the Project Does

The Conference Room Booking System allows users to:

- Book a conference room
- View room availability
- Cancel existing bookings

The system enforces business rules such as:

- A room cannot be double-booked for overlapping time slots
- A booking must reference an existing conference room
- Bookings must move through valid states only
- Invalid booking requests are rejected early (fail-fast)

All interactions are driven through a console-based menu.

---

## 🧠 Architectural Overview


### 🟦 Domain Models
Responsible for representing core business concepts and enforcing valid state transitions.

- `Booking`
- `ConferenceRoom`
- `BookingStatus`
- `RoomAvailability`

### 🟨 Business Logic
Encapsulates rules that operate across collections of domain objects.

- `BookingService`
  - Prevents overlapping bookings
  - Determines room availability at a given time
  - Validates booking requests
  - Creates and manages bookings

### 🟩 Program Orchestration
Handles user interaction and application flow.

- `Program.cs`
  - Displays menus
  - Captures user input
  - Delegates some functionalities to `BookingService`
  - Outputs results to the console

**Business logic is avoided in the`Program.cs`according to the instruction on the assignment**

---

## 🗂 Repository Structure

├── Program.cs
│ Console application entry point and orchestration
│
├── Domain/
│ ├── Booking.cs
│ │ Booking entity with state validation
│ │
│ ├── ConferenceRoom.cs
│ │ Represents a physical conference room
│ │
│ ├── BookingStatus.cs
│ │ Enum defining booking lifecycle states
│ │
│ └── RoomAvailability.cs
│ Enum used for availability representation
│
├── Services/
│ └── BookingService.cs
│ Business logic operating across collections
│
├── README.md
│ Project overview and architectural explanation
│
└── LICENSE
Project licensing information

yaml
Copy code

---

## ⚙️ Installation & Running the Project

### Prerequisites

- .NET SDK 8.x
- Visual Studio or Visual Studio Code

### Steps

1. Clone or copy the repository locally
2. Open the project in your IDE
3. Build the solution
4. Run the project
5. Interact with the console menu to:
   - Book rooms
   - View availability
   - Cancel bookings

---

## 🧩 Domain & Business Rules

The system enforces the following rules:

- A conference room cannot be double-booked for overlapping time slots
- All bookings reference existing rooms
- Booking state transitions are validated inside the domain
- Availability is derived dynamically based on current bookings
- Invalid requests fail fast and do not mutate system state

Time slots are automatically captured using the system clock, with a fixed booking duration.

---

## 📚 Project Scope

### In Scope

- Domain-driven design principles
- Explicit business rules
- Collection-based logic using LINQ
- Separation of domain, business logic, and orchestration
- Console-based interaction

### Out of Scope (for now)

- Databases or persistence
- Web APIs
- Authentication and authorization
- Graphical user interfaces
- Advanced scheduling (recurring bookings, variable durations)

---

## 📄 License

This project is licensed under the MIT License.

---

## ✍️ Author

**Name**  : TJ Gaba  
**Email** : tjgaba@outlook.com