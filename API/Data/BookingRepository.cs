using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ConferenceBooking.API.Entities;
using ConferenceBooking.API.Models;
using ConferenceBooking.API.DTO;

namespace ConferenceBooking.API.Data
{
    /// <summary>
    /// Repository for managing booking data access.
    /// All database operations for bookings are performed here.
    /// </summary>
    public class BookingRepository
    {
        private readonly ApplicationDbContext _dbContext;

        public BookingRepository(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        /// <summary>
        /// Retrieves all bookings from the database.
        /// DATABASE OPERATION: SELECT * FROM Bookings WITH JOIN to ConferenceRooms
        /// </summary>
        /// <returns>List of all bookings with their associated room information</returns>
        public async Task<List<Booking>> GetAllBookingsAsync()
        {
            return await _dbContext.Bookings.Include(b => b.Room).ToListAsync();
        }

        /// <summary>
        /// Retrieves paginated bookings from the database.
        /// DATABASE OPERATION: SELECT * FROM Bookings WITH JOIN, LIMIT and OFFSET for pagination
        /// </summary>
        /// <param name="page">Page number (1-based)</param>
        /// <param name="pageSize">Number of items per page</param>
        /// <returns>Tuple containing total count and paginated bookings</returns>
        public async Task<(int totalCount, List<Booking> bookings)> GetAllBookingsPaginatedAsync(int page, int pageSize)
        {
            // DATABASE OPERATION: Get total count - SELECT COUNT(*) FROM Bookings
            var totalCount = await _dbContext.Bookings.CountAsync();

            // DATABASE OPERATION: Get paginated results with SKIP and TAKE
            // Translates to SQL: SELECT * FROM Bookings LIMIT @pageSize OFFSET @skip
            // Order by Id descending (newer bookings have higher IDs)
            var bookings = await _dbContext.Bookings
                .Include(b => b.Room)
                .OrderByDescending(b => b.Id) // Order by ID instead of DateTimeOffset
                .Skip((page - 1) * pageSize) // Skip previous pages
                .Take(pageSize) // Take only current page items
                .ToListAsync();

            return (totalCount, bookings);
        }

        /// <summary>
        /// Retrieves a single booking by its ID.
        /// DATABASE OPERATION: SELECT * FROM Bookings WHERE Id = @id
        /// </summary>
        /// <param name="id">The booking ID to search for</param>
        /// <returns>The booking if found, null otherwise</returns>
        public async Task<Booking?> GetBookingByIdAsync(int id)
        {
            return await _dbContext.Bookings.Include(b => b.Room).FirstOrDefaultAsync(b => b.Id == id);
        }

        /// <summary>
        /// Get filtered bookings based on various criteria.
        /// All filtering happens at the database level using LINQ.
        /// </summary>
        public async Task<List<Booking>> GetFilteredBookingsAsync(FilterBookingsDTO filter)
        {
            // Start with base query including Room navigation property
            IQueryable<Booking> query = _dbContext.Bookings.Include(b => b.Room);

            // Apply filters only if they are provided (not null)
            // Each Where clause below builds the SQL query - NO data is fetched yet
            
            // DATABASE FILTER: Filter by room name using SQL LIKE
            if (!string.IsNullOrWhiteSpace(filter.RoomName))
            {
                query = query.Where(b => b.Room.Name.Contains(filter.RoomName)); // Translates to SQL: WHERE Room.Name LIKE '%filterValue%'
            }

            // DATABASE FILTER: Filter by location using SQL WHERE clause
            if (filter.Location.HasValue)
            {
                query = query.Where(b => b.Location == filter.Location.Value); // Translates to SQL: WHERE Booking.Location = @location
            }

            // DATABASE FILTER: Filter by date range - bookings that overlap with the specified range
            // Store filter values in local variables to help with SQL translation
            if (filter.StartDate.HasValue)
            {
                var filterStartDate = filter.StartDate.Value;
                query = query.Where(b => b.EndTime.CompareTo(filterStartDate) >= 0); // Translates to SQL: WHERE EndTime >= @startDate
            }

            if (filter.EndDate.HasValue)
            {
                var filterEndDate = filter.EndDate.Value;
                query = query.Where(b => b.StartTime.CompareTo(filterEndDate) <= 0); // Translates to SQL: WHERE StartTime <= @endDate
            }

            // DATABASE FILTER: Filter by room active status using JOIN
            if (filter.IsActiveRoom.HasValue)
            {
                query = query.Where(b => b.Room.IsActive == filter.IsActiveRoom.Value); // Translates to SQL: WHERE Room.IsActive = @isActive
            }

            // DATABASE FILTER: Filter by booking status
            if (!string.IsNullOrWhiteSpace(filter.Status))
            {
                if (Enum.TryParse<BookingStatus>(filter.Status, true, out var status))
                {
                    query = query.Where(b => b.Status == status); // Translates to SQL: WHERE Status = @status
                }
            }

            // *** DATABASE EXECUTION POINT ***
            // ToListAsync() executes the complete SQL query at the database level
            // All WHERE clauses above are combined into a single SQL SELECT statement
            return await query.ToListAsync();
        }

        /// <summary>
        /// Get filtered and paginated bookings based on various criteria.
        /// All filtering happens at the database level using LINQ.
        /// </summary>
        /// <param name="filter">Filter criteria</param>
        /// <param name="page">Page number (1-based)</param>
        /// <param name="pageSize">Number of items per page</param>
        /// <returns>Tuple containing total count and paginated filtered bookings</returns>
        public async Task<(int totalCount, List<Booking> bookings)> GetFilteredBookingsPaginatedAsync(FilterBookingsDTO filter, int page, int pageSize)
        {
            // Start with base query including Room navigation property
            IQueryable<Booking> query = _dbContext.Bookings.Include(b => b.Room);

            // Apply all filters (same as GetFilteredBookingsAsync)
            
            // DATABASE FILTER: Filter by room name using SQL LIKE
            if (!string.IsNullOrWhiteSpace(filter.RoomName))
            {
                query = query.Where(b => b.Room.Name.Contains(filter.RoomName)); // Translates to SQL: WHERE Room.Name LIKE '%filterValue%'
            }

            // DATABASE FILTER: Filter by location using SQL WHERE clause
            if (filter.Location.HasValue)
            {
                query = query.Where(b => b.Location == filter.Location.Value); // Translates to SQL: WHERE Booking.Location = @location
            }

            // DATABASE FILTER: Filter by date range - bookings that overlap with the specified range
            if (filter.StartDate.HasValue)
            {
                var filterStartDate = filter.StartDate.Value;
                query = query.Where(b => b.EndTime.CompareTo(filterStartDate) >= 0); // Translates to SQL: WHERE EndTime >= @startDate
            }

            if (filter.EndDate.HasValue)
            {
                var filterEndDate = filter.EndDate.Value;
                query = query.Where(b => b.StartTime.CompareTo(filterEndDate) <= 0); // Translates to SQL: WHERE StartTime <= @endDate
            }

            // DATABASE FILTER: Filter by room active status using JOIN
            if (filter.IsActiveRoom.HasValue)
            {
                query = query.Where(b => b.Room.IsActive == filter.IsActiveRoom.Value); // Translates to SQL: WHERE Room.IsActive = @isActive
            }

            // DATABASE FILTER: Filter by booking status
            if (!string.IsNullOrWhiteSpace(filter.Status))
            {
                if (Enum.TryParse<BookingStatus>(filter.Status, true, out var status))
                {
                    query = query.Where(b => b.Status == status); // Translates to SQL: WHERE Status = @status
                }
            }

            // DATABASE OPERATION: Get total count of filtered results - SELECT COUNT(*) FROM ... WHERE ...
            var totalCount = await query.CountAsync();

            // DATABASE OPERATION: Apply pagination - LIMIT and OFFSET
            // Translates to SQL: SELECT * FROM ... WHERE ... ORDER BY ... LIMIT @pageSize OFFSET @skip
            // Order by Id descending (newer bookings have higher IDs)
            var bookings = await query
                .OrderByDescending(b => b.Id) // Order by ID instead of DateTimeOffset
                .Skip((page - 1) * pageSize) // Skip previous pages
                .Take(pageSize) // Take only current page items
                .ToListAsync();

            return (totalCount, bookings);
        }

        /// <summary>
        /// Adds a new booking to the database.
        /// DATABASE OPERATION: INSERT INTO Bookings VALUES (...)
        /// </summary>
        /// <param name="booking">The booking entity to add</param>
        public async Task AddBookingAsync(Booking booking)
        {
            // Add booking to the change tracker
            await _dbContext.Bookings.AddAsync(booking);
            // Persist changes to database
            await _dbContext.SaveChangesAsync();
        }

        /// <summary>
        /// Updates an existing booking in the database.
        /// DATABASE OPERATION: UPDATE Bookings SET ... WHERE Id = @id
        /// </summary>
        /// <param name="booking">The booking entity with updated values</param>
        public async Task UpdateBookingAsync(Booking booking)
        {
            // Mark entity as modified in change tracker
            _dbContext.Bookings.Update(booking);
            // Persist changes to database
            await _dbContext.SaveChangesAsync();
        }

        /// <summary>
        /// Deletes a booking from the database by ID.
        /// DATABASE OPERATION: DELETE FROM Bookings WHERE Id = @id
        /// </summary>
        /// <param name="id">The ID of the booking to delete</param>
        public async Task DeleteBookingAsync(int id)
        {
            // First, retrieve the booking
            var booking = await GetBookingByIdAsync(id);
            if (booking != null)
            {
                // Remove from change tracker
                _dbContext.Bookings.Remove(booking);
                // Persist deletion to database
                await _dbContext.SaveChangesAsync();
            }
        }
    }
}