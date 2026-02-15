# Relationship Integrity & Data Protection

## Overview
This document outlines the relationship enforcement mechanisms implemented in the Conference Booking System to ensure data integrity, prevent orphaned records, and maintain referential consistency.

## Core Relationships

### 1. Booking ↔ Room
**Entity Configuration:**
- `Booking.RoomId` (Foreign Key) → `ConferenceRoom.Id`
- `Booking.Room` (Navigation Property)
- Delete Behavior: `Restrict`

**Enforcement Rules:**
✅ **Cannot create booking for non-existent room**
- Validated in: `BookingController.CreateBooking()` (line 280-287)
- Validated in: `BookingManager.CreateBookingAsync()` (line 71-73)

✅ **Cannot create booking for inactive room**
- Validated in: `BookingController.CreateBooking()` (line 290-293)
- Validated in: `BookingController.UpdateBooking()` (line 413-416)
- Validated in: `BookingManager.CreateBookingAsync()` (line 81-84)
- HTTP Response: `400 Bad Request` - "This room is not currently available for booking."

✅ **Cannot deactivate room with future bookings**
- Validated in: `RoomManagementController.UpdateRoomStatus()` (line 35-46)
- Validated in: `RoomManagementController.UpdateRoom()` (line 98-109)
- Validated in: `RoomManagementController.DeactivateRoom()` (line 174-181)
- HTTP Response: `400 Bad Request` - "Cannot deactivate room with future confirmed bookings."

✅ **Cascade Delete Prevention**
- Database Configuration: `OnDelete(DeleteBehavior.Restrict)`
- Prevents accidental deletion of rooms that have booking history
- Must soft-delete rooms (set `IsActive = false`) instead

---

### 2. Booking ↔ User
**Entity Configuration:**
- `Booking.UserId` (Foreign Key) → `ApplicationUser.Id`
- `Booking.User` (Navigation Property)
- `ApplicationUser.Bookings` (Collection Navigation)
- Delete Behavior: `Restrict`

**Enforcement Rules:**
✅ **Only active users can create bookings**
- Validated in: `BookingController.CreateBooking()` (line 274-278)
- HTTP Response: `403 Forbidden` when inactive user attempts booking

✅ **Only active users can update bookings**
- Validated in: `BookingController.UpdateBooking()` (line 388-392)
- HTTP Response: `403 Forbidden` when inactive user attempts update

✅ **Cascade Delete Prevention**
- Database Configuration: `OnDelete(DeleteBehavior.Restrict)`
- User deactivation doesn't affect existing bookings
- Preserves historical booking data for audit purposes

---

### 3. ConferenceSession ↔ Room
**Entity Configuration:**
- `ConferenceSession.RoomId` (Foreign Key, nullable) → `ConferenceRoom.Id`
- `ConferenceSession.Room` (Navigation Property)
- Delete Behavior: `SetNull`

**Enforcement Rules:**
✅ **Sessions can exist without room assignment**
- Room assignment is optional
- When room is deleted, session remains but `RoomId` set to `null`

---

### 4. UserSession ↔ User
**Entity Configuration:**
- `UserSession.UserId` (Foreign Key) → `ApplicationUser.Id`
- Delete Behavior: `Cascade`

**Enforcement Rules:**
✅ **User deletion cascades to sessions**
- When user is hard-deleted (rare), all their sessions are removed
- Normal user deactivation (soft delete) doesn't affect sessions

---

### 5. UserStatusHistory ↔ User
**Entity Configuration:**
- `UserStatusHistory.UserId` (Foreign Key) → `ApplicationUser.Id`
- Delete Behavior: `Cascade`

**Enforcement Rules:**
✅ **Audit trail preserved until user hard-deletion**
- Status change history maintained for active and inactive users
- Only removed if user is permanently deleted from system

---

## Database-Level Protection

### Foreign Key Constraints
All relationships use proper foreign key constraints configured in `ApplicationDbContext`:

```csharp
// Booking-Room relationship
modelBuilder.Entity<Booking>()
    .HasOne(b => b.Room)
    .WithMany()
    .HasForeignKey(b => b.RoomId)
    .OnDelete(DeleteBehavior.Restrict);

// Booking-User relationship
modelBuilder.Entity<Booking>()
    .HasOne(b => b.User)
    .WithMany(u => u.Bookings)
    .HasForeignKey(b => b.UserId)
    .OnDelete(DeleteBehavior.Restrict);
```

### Index Configuration
Performance indexes on foreign keys:
- `Booking.RoomId` (implicit via FK)
- `Booking.UserId` (implicit via FK)
- `UserSession.UserId` + composite index
- `UserStatusHistory.UserId`

---

## Application-Level Validation

### Room Availability Check
Before allowing booking creation or update:
1. ✅ Room exists (`AnyAsync`)
2. ✅ Room is active (`room.IsActive == true`)
3. ✅ No time conflicts with confirmed bookings
4. ✅ Requested capacity doesn't exceed room capacity

### User Authorization Check
Before allowing booking operations:
1. ✅ User is authenticated (`User.Identity?.Name != null`)
2. ✅ User exists in system (`FindByNameAsync`)
3. ✅ User is active (`user.IsActive == true`)
4. ✅ User has appropriate role (via `[Authorize(Roles)]`)

### Room Deactivation Check
Before allowing room deactivation:
1. ✅ No future confirmed bookings exist
2. ✅ Current and past bookings are preserved
3. ✅ Can reactivate room later if needed

---

## Soft Delete Pattern

### Rooms
- Field: `ConferenceRoom.IsActive`
- Default: `true`
- When deactivated:
  - Existing bookings preserved
  - New bookings prevented
  - Room appears in filtered queries with `IsActive = false`
  - Can be reactivated if no data conflicts

### Users
- Field: `ApplicationUser.IsActive`
- Field: `ApplicationUser.DeletedAt` (timestamp)
- Default: `IsActive = true`, `DeletedAt = null`
- When deactivated:
  - Existing bookings preserved
  - Cannot create new bookings
  - Cannot update existing bookings
  - Login prevented (handled by Identity)
  - Audit trail via `UserStatusHistory`

---

## Error Responses

### Invalid Room Reference
```http
POST /api/booking
{
  "roomId": 999,  // Non-existent room
  ...
}

Response: 409 Conflict
{
  "Message": "Room does not exist."
}
```

### Inactive Room Booking Attempt
```http
POST /api/booking
{
  "roomId": 5,  // IsActive = false
  ...
}

Response: 400 Bad Request
{
  "Message": "This room is not currently available for booking."
}
```

### Inactive User Booking Attempt
```http
POST /api/booking
Authorization: Bearer <token-for-inactive-user>
{
  ...
}

Response: 403 Forbidden
```

### Room Deactivation with Active Bookings
```http
PATCH /api/roommanagement/5/status
{
  "isActive": false
}

Response: 400 Bad Request
{
  "Message": "Cannot deactivate room with future confirmed bookings. Please cancel bookings first."
}
```

---

## Test Scenarios

### ✅ Scenario 1: Prevent Booking Creation for Inactive Room
1. Deactivate a room via `PATCH /api/roommanagement/{id}/status`
2. Attempt to create booking for that room
3. **Expected:** `400 Bad Request` - Room not available

### ✅ Scenario 2: Prevent Room Deactivation with Future Bookings
1. Create confirmed booking for future date
2. Attempt to deactivate the room
3. **Expected:** `400 Bad Request` - Cannot deactivate with active bookings

### ✅ Scenario 3: Prevent Booking by Inactive User
1. Deactivate user via `DELETE /api/usermanagement/{id}/deactivate`
2. Attempt to create booking as that user
3. **Expected:** `403 Forbidden`

### ✅ Scenario 4: Preserve Booking History on Room Deactivation
1. Create and complete a booking (past dates)
2. Deactivate the room
3. Query bookings
4. **Expected:** Historical bookings still visible

### ✅ Scenario 5: Update Booking to Different Room
1. Create booking for Room A
2. Update booking to inactive Room B
3. **Expected:** `400 Bad Request` - Selected room not available
4. Update booking to active Room C
5. **Expected:** `200 OK` - Successfully updated

---

## Benefits of This Approach

### 1. **Data Integrity**
- No orphaned bookings
- No references to non-existent rooms or users
- Consistent state across all tables

### 2. **Historical Data Preservation**
- Soft deletes maintain audit trail
- Can analyze past bookings even for inactive rooms
- User deactivation doesn't lose booking history

### 3. **Safety**
- Cannot accidentally delete critical resources
- Database-level constraints as last line of defense
- Application-level validation provides clear error messages

### 4. **Extensibility**
- Easy to add new relationships with same patterns
- Clear separation of concerns between layers
- Well-documented validation points

### 5. **Compliance**
- Audit trail for all status changes
- Preserves data for regulatory requirements
- Traceable changes via `UserStatusHistory`

---

## Implementation Checklist

- [x] Foreign key constraints configured
- [x] Navigation properties defined
- [x] Cascade behaviors set appropriately
- [x] Room active status validation on booking creation
- [x] Room active status validation on booking update
- [x] User active status validation on booking creation
- [x] User active status validation on booking update
- [x] Room deactivation validation (future bookings check)
- [x] Soft delete implementation for rooms
- [x] Soft delete implementation for users
- [x] Audit trail for user status changes
- [x] Appropriate HTTP status codes for each error case
- [x] Clear error messages for validation failures
- [x] Database indexes for performance
- [x] Unit test scenarios defined

---

## Future Enhancements

### Potential Additions:
1. **Conference Session Validation**
   - Prevent session creation for inactive rooms
   - Add soft delete for sessions

2. **Booking Co-organizers**
   - Support multiple users per booking
   - Validate all co-organizers are active

3. **Department/Location Restrictions**
   - Enforce room booking rules based on user department
   - Location-based access control

4. **Capacity Enforcement**
   - Prevent booking room with insufficient capacity
   - Track actual attendees vs. requested capacity

5. **Time-based Auto-cancellation**
   - Auto-cancel pending bookings after X hours
   - Auto-release no-show bookings

---

## Maintenance Notes

### When Adding New Entities:
1. Define foreign key relationships in entity classes
2. Configure relationships in `ApplicationDbContext.OnModelCreating()`
3. Choose appropriate delete behavior (`Restrict`, `Cascade`, `SetNull`)
4. Add validation at application level (controllers/services)
5. Create appropriate error responses
6. Update this documentation

### When Modifying Relationships:
1. Create new migration via `dotnet ef migrations add <name>`
2. Review generated migration SQL
3. Test migration on development database
4. Update relationship documentation
5. Add/update test scenarios

---

## Related Files

- **Entity Models:**
  - `API/Models/Booking.cs`
  - `API/Entities/ConferenceRoom.cs`
  - `API/Auth/ApplicationUser.cs`
  - `API/DTO/UserStatusHistory.cs`

- **Database Configuration:**
  - `API/Data/ApplicationDbContext.cs`

- **Controllers with Validation:**
  - `API/Controllers/BookingController.cs`
  - `API/Controllers/RoomManagementController.cs`
  - `API/Controllers/UserManagementController.cs`

- **Services:**
  - `API/Services/BookingManager.cs`

- **Migrations:**
  - `API/Migrations/` (all migration files)

---

**Last Updated:** February 15, 2026  
**Version:** 1.0  
**Maintained By:** Development Team
