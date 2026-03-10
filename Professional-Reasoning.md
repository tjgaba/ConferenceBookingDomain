# Professional Reasoning: Database Schema Evolution

## 1. Why is removing a column more dangerous than adding one?

**Removing a column is destructive and irreversible:**
- **Data loss**: All data in that column is permanently deleted
- **Breaking changes**: Existing application code, queries, and APIs that reference the column will immediately fail
- **Rollback difficulty**: Cannot easily undo without restoring from backup

**Adding a column is non-destructive:**
- No data loss occurs
- Can provide default values for existing rows
- Existing code continues to work (ignores new column until updated)
- Easy to rollback by simply removing the new column

## 2. Why are migrations preferred over manual SQL changes?

**Migrations provide:**
- **Version control**: Schema changes tracked in source code with full history
- **Repeatability**: Same changes apply consistently across all environments (dev, staging, production)
- **Team synchronization**: All developers get schema updates automatically when pulling code
- **Rollback capability**: Can revert to previous schema states using migration history
- **Documentation**: Migration files serve as clear record of what changed and when
- **Automation**: Can be applied automatically in CI/CD pipelines

**Manual SQL risks:**
- No tracking of who made changes or when
- Difficult to replicate across environments
- Easy to miss changes when deploying
- No standardized rollback mechanism

## 3. What could go wrong if two developers modify the schema without migrations?

**Conflicts and inconsistencies:**
- **Divergent databases**: Developer A and B have different schemas locally, neither knowing about the other's changes
- **Merge nightmares**: No way to merge conflicting schema changes (e.g., both add different columns with same name)
- **Lost changes**: One developer's manual changes could overwrite another's
- **Production mismatch**: No clear source of truth for what the production schema should be
- **Broken deployments**: Code deployed expects schema that doesn't exist in other environments
- **No audit trail**: Cannot determine which change caused issues or when it was made

## 4. Which of your schema changes would be risky in production, and why?

### High Risk Changes:

**1. Adding `Location` and `Capacity` to Bookings table**
- **Risk**: Existing bookings in production have no values for these new required fields
- **Impact**: Without proper defaults, could cause application errors or data integrity issues
- **Migration**: Used proper defaults (Location = enum value, Capacity = 0), but semantically incorrect for historical data

**2. Changing booking creation from `Confirmed` to `Pending` status**
- **Risk**: Behavioral change affects business logic
- **Impact**: All new bookings now require receptionist confirmation, changing workflow
- **Deployment**: Would need coordinated release with updated client code and user training

**3. Adding `CreatedAt` and `CancelledAt` timestamps to existing Bookings**
- **Risk**: Existing bookings get backdated timestamps (SQL `datetime('now')` applies to migration time)
- **Impact**: Historical data shows incorrect creation dates
- **Migration**: All existing bookings appear created at migration runtime, losing actual historical dates

### Low Risk Changes:

**1. Adding `Session` entity (new table)**
- **Safe**: No existing data affected, purely additive
- **Impact**: None until feature is actively used

**2. Adding `IsActive` flag to ConferenceRoom**
- **Safe**: Default value `true` maintains existing behavior
- **Impact**: Existing rooms remain active by default

**3. Adding inactive room and test data (Room 26, Session 9001, Booking 9001)**
- **Safe**: Uses high IDs to avoid conflicts, purely additive test data
- **Impact**: None on existing production data

### Best Practices for Production:

1. **Always include data migration scripts** alongside schema migrations
2. **Use feature flags** for behavioral changes (Pending vs Confirmed)
3. **Test migrations on production-like data** before deployment
4. **Plan rollback strategy** before applying risky changes
5. **Schedule downtime** for breaking changes or ensure backward compatibility
