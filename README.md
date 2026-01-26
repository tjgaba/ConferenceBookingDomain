# 🏢 Conference Room Booking Domain Model

## 📑 Table of Contents

* [📌 Purpose of This Repository](#-purpose-of-this-repository)
* [🚀 What the Project Does](#-what-the-project-does)
* [🗂 Repository Contents](#-repository-contents)
* [⚙️ Installation](#️-installation)
* [🤝 Contributing](#-contributing)
* [🧩 Domain Context](#-domain-context)
* [📚 Project Scope](#-project-scope)
* [📄 License](#-license)
* [✍️ Author](#️-author)

---

## 📌 Purpose of This Repository

This repository contains the **core domain model** for the *Conference Room Booking System*.

The project has **not** been fully built yet, but the design and express of the *core business concepts, rules, and constraints* of the domain are to be attended on a later stage of the project.

This codebase is intended to be reused later when building:

* Web APIs
* Persistence layers (databases)
* Frontend or client applications

---

## 🚀 What the Project Does

The **Conference Room Booking Domain Model** represents the fundamental building blocks required to support conference room bookings system.

At this stage, the project focuses on modelling:

* Conference rooms
* Availability
* Booking requests
* Booking states
* And business rules

---

## 🗂 Repository Contents

The repository is organised as follows:

```
├── Program.cs
│   Entry point used only to exercise and demonstrate the domain model
│
├── ConferenceRoom.cs
│   Represents a physical conference room and its constraints
│
├── Booking.cs
│   Represents a booking request and enforces booking rules
│
├── BookingStatus.cs
│   Enum defining the lifecycle states of a booking
│
├── RoomAvailability.cs
│   Enum defining room availability rules
│
├── README.md
│   Project overview and domain explanation
│
└── LICENSE
    Project licensing information
```

---

## ⚙️ Installation

**Prerequisites**

To work with this project locally, ensure you have:

* .NET SDK (8.0.147 )
* Visual Studio or Visual Studio Code

**Steps**

1. Clone or copy the repository to your local machine
2. Open the project folder in your IDE
3. Build the project
4. Run the project

---

## 🤝 Contributing

Contributions at this stage are withholded, because it is currently a solo project. But Pull Requests from branches are adviced whenever making changes with the code/files. The purpose therefore is to:

* Improve clarity of the domain model structure
* State business rules
* Impliment documentation and git commits

Contributions should:

* Be focus on domain logic
* Be submitted via Pull Requests

---

## 🧩 Domain Context

The Conference Room Booking domain is concerned with:

* Managing meeting spaces
* Availability 
* Tracking booking states
* Preventing inconsistent system states

---

## 📚 Project Scope

**In scope**:

* Core domain entities
* Domain enums representing business rules
* Explicit state transitions
* Intentional modelling of real-world concepts

**Out of scope (for now)**:

* Databases
* Web APIs
* Authentication and authorization
* User interfaces
* Auto Scheduling

---

## 📄 License

This project is licensed under the MIT License.

---

## ✍️ Author

Name            :**TJ Gaba**
Email           :**tjgaba@outlook.com**
