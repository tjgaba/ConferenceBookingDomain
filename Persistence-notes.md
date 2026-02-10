# Persistence Layer Notes

## Why In-Memory Storage is Not Production-Ready

In-memory storage (e.g., `List<Booking>`) has critical limitations:
- **Data Loss**: All data is lost when the application restarts
- **Concurrency Issues**: No built-in support for concurrent access from multiple users
- **Scalability**: Cannot distribute across multiple servers or scale horizontally
- **No Transactions**: Cannot guarantee ACID properties for complex operations
- **Limited Querying**: No optimized indexing or advanced query capabilities

## What DbContext Represents

`ApplicationDbContext` is the **bridge between your domain model and the database**:
- Manages database connections and transaction lifecycle
- Tracks entity changes and synchronizes them with the database
- Provides `DbSet<T>` collections representing database tables
- Executes LINQ queries and translates them to SQL
- Implements the **Unit of Work** pattern (batches changes, commits atomically)

## How EF Core Fits Into the Architecture

```
Controllers → BookingManager → ApplicationDbContext → Database
                  ↓                      ↓
           Domain Logic           Persistence Layer
```

- **Separation of Concerns**: Business logic (`BookingManager`) is isolated from persistence details
- **Repository Pattern**: `DbContext` acts as a repository, abstracting database operations
- **Testability**: Easy to mock `DbContext` for unit testing
- **Database Agnostic**: Can switch from SQLite to SQL Server/PostgreSQL without changing business logic

## How This Prepares the System for Growth

### **Relationships**
- Foreign keys (`RoomId` in `Booking`) enable efficient joins
- Navigation properties (`Booking.Room`) allow lazy/eager loading
- EF Core handles cascade deletes and referential integrity

### **Ownership**
- User authentication via ASP.NET Core Identity is integrated
- `RequestedBy` field can be replaced with `UserId` foreign key
- Role-based access control already implemented (`[Authorize(Roles = "Admin")]`)
- Future: Add `Booking.OwnerId` to restrict users to their own bookings

### **Frontend Usage**
- **RESTful API** with proper HTTP verbs and status codes
- **JWT Authentication** enables stateless, scalable authentication
- **DTO Pattern** separates internal models from API contracts
- **JSON Serialization** ready for any frontend (React, Angular, Vue)
- **CORS Support** can be added for browser-based clients
- **Swagger/OpenAPI** provides auto-generated API documentation

---

**Key Takeaway**: By using EF Core with `DbContext`, we've built a **production-ready persistence layer** that supports concurrent users, maintains data integrity, and is ready to scale with complex features like multi-user ownership and real-time frontend integration.
