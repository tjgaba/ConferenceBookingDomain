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
    public class BookingRepository
    {
        private readonly ApplicationDbContext _dbContext;

        public BookingRepository(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<Booking>> GetAllBookingsAsync()
        {
            return await _dbContext.Bookings.Include(b => b.Room).ToListAsync();
        }

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
            
            // Filter by room name
            if (!string.IsNullOrWhiteSpace(filter.RoomName))
            {
                query = query.Where(b => b.Room.Name.Contains(filter.RoomName));
            }

            // Filter by location (booking's location, not room's location)
            if (filter.Location.HasValue)
            {
                query = query.Where(b => b.Location == filter.Location.Value);
            }

            // Filter by date range - bookings that overlap with the specified range
            if (filter.StartDate.HasValue)
            {
                query = query.Where(b => b.EndTime >= filter.StartDate.Value);
            }

            if (filter.EndDate.HasValue)
            {
                query = query.Where(b => b.StartTime <= filter.EndDate.Value);
            }

            // Filter by room active status
            if (filter.IsActiveRoom.HasValue)
            {
                query = query.Where(b => b.Room.IsActive == filter.IsActiveRoom.Value);
            }

            // Filter by booking status
            if (!string.IsNullOrWhiteSpace(filter.Status))
            {
                if (Enum.TryParse<BookingStatus>(filter.Status, true, out var status))
                {
                    query = query.Where(b => b.Status == status);
                }
            }

            // Execute query at database level and return results
            return await query.ToListAsync();
        }

        public async Task AddBookingAsync(Booking booking)
        {
            await _dbContext.Bookings.AddAsync(booking);
            await _dbContext.SaveChangesAsync();
        }

        public async Task UpdateBookingAsync(Booking booking)
        {
            _dbContext.Bookings.Update(booking);
            await _dbContext.SaveChangesAsync();
        }

        public async Task DeleteBookingAsync(int id)
        {
            var booking = await GetBookingByIdAsync(id);
            if (booking != null)
            {
                _dbContext.Bookings.Remove(booking);
                await _dbContext.SaveChangesAsync();
            }
        }
    }
}