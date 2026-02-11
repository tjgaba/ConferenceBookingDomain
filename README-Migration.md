# Migration Design Decisions

This document explains the design rationale behind field nullability and default values in the Conference Booking System database schema.

---

## Field Nullability Explained

### The Core Principle

The fundamental rule is simple: if a business requirement states that data must exist, the field is non-nullable. If data is optional or may be added later, the field is nullable. This moves validation from application code into the database structure itself, creating stronger data integrity guarantees.

### Booking Entity

All booking fields are non-nullable except **`CancelledAt`**. The `Id`, `RoomId`, `RequestedBy`, `StartTime`, `EndTime`, `Status`, `Location`, and `Capacity` fields must always have values because a booking without any of these is meaningless or incomplete. For example, a booking without a room (`RoomId`) or time range (`StartTime`/`EndTime`) cannot logically exist in the system.

The `CancelledAt` field is nullable because it only has meaning when a booking has been cancelled. Active bookings have NULL, while cancelled bookings carry the exact timestamp of cancellation. This creates a clear distinction between "never cancelled" and "cancelled at a specific time" and enables precise audit queries.

The `CreatedAt` field uses a SQL-level default of `datetime('now')`, meaning the database automatically sets the timestamp during insert operations. This ensures the timestamp is set reliably even if application code forgets, provides a single source of truth from the database server's clock, and prevents manipulation by the application layer.

### ConferenceRoom Entity

All room fields are non-nullable because rooms must have complete information: a unique `Id`, human-readable `Name`, `Capacity` for matching to bookings, physical room `Number`, office `Location`, and `IsActive` status. The `IsActive` boolean implements the soft-delete pattern—rooms are never physically deleted, just marked inactive. This preserves historical data for audit trails and maintains foreign key integrity for existing bookings.

### Session Entity

The `RoomId` is nullable to support workflow flexibility. Sessions can be created before a specific room is assigned, supporting scenarios where an event is planned but the venue is determined later. The foreign key uses `OnDelete(DeleteBehavior.SetNull)`, so if a room is deleted, the session is preserved but becomes unlinked. The `Description` field is also nullable because detailed descriptions are optional—not all sessions need extensive additional information.

---

## Default Values Strategy

### Migration Defaults vs Business Defaults

When adding required fields to existing tables, migrations face a challenge: new columns cannot be null, but existing rows have no values. The solution uses temporary defaults like `DEFAULT 0` for Capacity and `DEFAULT 0` (London) for Location. While these are semantically incorrect for historical data, they prevent migration failures and allow the system to continue operating. Production deployments would follow up with data migration scripts to populate accurate historical values.

### Why Database-Level Defaults

Database defaults (like `datetime('now')` for `CreatedAt`) are preferred over application-level defaults for several reasons: they provide consistency across all insert operations regardless of which application code executes them, improve performance by eliminating roundtrips, and create stronger audit compliance by preventing manipulation.

---

## Design Patterns Applied

**Soft Deletes**: The `IsActive` boolean flag is used instead of physical row deletion. This preserves complete audit trails, enables potential "undelete" functionality, and maintains foreign key integrity.

**Timezone Awareness**: All date fields use `DateTimeOffset` instead of `DateTime` to support multi-location operations across London, Cape Town, Johannesburg, Bloemfontein, and Durban. This prevents timezone conversion bugs and ensures accurate scheduling.

**Enum Storage**: Enums are stored as integers (0, 1, 2) in the database for efficiency, but the API uses `JsonStringEnumConverter` to return human-readable strings ("London", "CapeTown"). This provides efficient database operations with self-documenting API responses.

**Foreign Key Behaviors**: Different relationships require different delete behaviors. Booking-to-Room uses `Restrict` (cannot delete rooms with bookings), while Session-to-Room uses `SetNull` (sessions preserved if room deleted).

---

## Schema Evolution Best Practices

Safe changes include adding nullable columns, new tables, or non-nullable columns with sensible defaults. Risky changes include removing columns (data loss), adding required fields without defaults, or changing column types (potential data truncation).

To evolve schema safely: always provide defaults for new required fields, test migrations on production-like data before deployment, plan data migration scripts for meaningful defaults, use feature flags for behavioral changes, keep migrations small and focused, and document breaking changes in migration comments.

---

## Summary

Nullability decisions are driven by business rules distinguishing required from optional data, data integrity constraints preventing invalid states, and workflow flexibility requirements. Default values enable safe schema evolution, maintain consistency, support automatic audit field population, and minimize manual migration work. The result is a robust schema that balances strict enforcement of business rules with flexibility for future changes.

