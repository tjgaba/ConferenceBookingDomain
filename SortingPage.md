# Sorting Before Pagination Logic

## Overview
This document explains how sorting is applied before pagination in the Conference Booking API to ensure consistent and predictable results.

## Why Sort Before Pagination?

Sorting must occur before pagination to ensure the integrity and reliability of paginated results. When sorting happens after pagination, the results become inconsistent and unpredictable because only a subset of data gets sorted, leading to the same records potentially appearing on different pages across requests. By sorting the entire dataset first, we guarantee consistency where the same data always appears on the same page. This approach ensures predictability, allowing users to rely on a stable sort order when navigating through pages. Most importantly, it ensures correctness by making paginated results accurately reflect the complete sorted dataset rather than arbitrarily ordered subsets.

In summary, sorting before pagination ensures:
- **Consistency**: Same data appears on the same page across requests
- **Predictability**: Users can rely on a stable sort order
- **Correctness**: Paginated results reflect the complete sorted dataset

## Implementation Flow

The implementation follows a carefully orchestrated sequence of operations to ensure optimal performance and correct results. The process begins with query building, where we start with the base query that includes necessary joins to related entities. Once the base query is established, we apply any filters that have been specified in the request. After filtering comes the critical sorting step, which occurs before pagination. Only after the data has been properly sorted does pagination occur, ensuring that users receive a consistent subset of the sorted results.

### 1. Query Building
```csharp
IQueryable<Booking> query = _dbContext.Bookings.Include(b => b.Room);
```
Start with the base query including necessary joins to avoid additional database round trips.

### 2. Apply Filters (if any)
```csharp
if (!string.IsNullOrWhiteSpace(filter.RoomName))
{
    query = query.Where(b => b.Room.Name.Contains(filter.RoomName));
}
// ... additional filters
```
Filter the dataset before sorting. These filters are applied conditionally based on user input, such as filtering by room name, location, date range, or room status. Each filter adds a WHERE clause to the underlying SQL query.

### 3. Apply Sorting (BEFORE Pagination)
```csharp
query = ApplySorting(query, sortBy, sortOrder);
```

The `ApplySorting` method examines the requested sort field and order, then applies the appropriate OrderBy or OrderByDescending operation. It handles three sort fields:
- **Date**: Sorts by `StartTime`
- **RoomName**: Sorts by `Room.Name`
- **CreatedAt**: Sorts by `CreatedAt` (default)

Each supports ascending (`asc`) or descending (`desc`) order.

### 4. Apply Pagination (AFTER Sorting)
```csharp
var bookings = await query
    .Skip((page - 1) * pageSize)  // Skip previous pages
    .Take(pageSize)                // Take current page
    .ToListAsync();
```
Using the Skip and Take methods, we calculate how many records to skip based on the requested page number and page size, then retrieve only the specific slice of data needed for the current page.

## SQL Translation

When the LINQ query is executed, Entity Framework Core translates it into efficient SQL that performs all operations at the database level. The critical aspect of this translation is that the ORDER BY clause appears before the LIMIT and OFFSET clauses, ensuring that sorting happens on the complete dataset before any pagination is applied.

The LINQ query translates to SQL as:
```sql
SELECT * FROM Bookings
INNER JOIN ConferenceRooms ON Bookings.RoomId = ConferenceRooms.Id
WHERE [filters]
ORDER BY [sort field] [asc/desc]
LIMIT @pageSize OFFSET @skip
```

**Order matters**: `ORDER BY` clause appears **before** `LIMIT/OFFSET`.

## Sorting Options

The API provides three sorting fields to accommodate different use cases, each supporting both ascending and descending order to give users full control over how they want to view their data.

| Sort Field | Description | Example |
|------------|-------------|---------|
| `Date` | Booking start time | `?sortBy=Date&sortOrder=asc` |
| `RoomName` | Room name alphabetically | `?sortBy=RoomName&sortOrder=desc` |
| `CreatedAt` | Booking creation timestamp | `?sortBy=CreatedAt&sortOrder=desc` |

**Default**: If no `sortBy` is specified, sorts by `CreatedAt` descending (newest first).

## Example Request

Consider a request to retrieve the second page of bookings sorted by room name in ascending order:

```http
GET /api/booking/all?page=2&pageSize=10&sortBy=RoomName&sortOrder=asc
```

**Execution order:**
1. Fetch all bookings
2. Sort by RoomName ascending (A → Z)
3. Skip first 10 results (page 1)
4. Return next 10 results (page 2)

This approach guarantees that if a user navigates back to page 1 or forward to page 3, the results remain consistent because the sorting order is stable across all pages.

## Performance Benefits

This implementation approach delivers significant performance advantages through database-level execution. All operations including filtering, sorting, and pagination happen entirely within the database server rather than in application memory. The approach is particularly efficient because only the requested page of data is transferred from the database to the application, minimizing network traffic and memory usage. Additionally, the database can utilize indexes on commonly sorted fields, dramatically speeding up the sorting operation.

Key performance advantages:
- **Database-level execution**: All operations (filter, sort, paginate) happen in the database
- **Efficient queries**: Only requested page data is transferred
- **Indexed sorting**: Database can use indexes on `StartTime`, `CreatedAt`, and `Room.Name`

This architecture ensures that performance remains consistent regardless of the total dataset size, making the system scalable and responsive even as the number of bookings grows over time.
