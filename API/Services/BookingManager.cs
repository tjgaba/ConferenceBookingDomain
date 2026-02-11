using System;
using System.Collections.Generic;
using System.Linq;
using System.IO;
using System.Text.Json;
using System.Threading.Tasks;
using ConferenceBooking.Persistence;
using ConferenceBooking.API.Exceptions;
using ConferenceBooking.API.Entities;
using ConferenceBooking.API.Services;
using ConferenceBooking.API.Models;
using Microsoft.EntityFrameworkCore;

namespace ConferenceBooking.API.Services
{
    public class BookingManager
    {
        private readonly ApplicationDbContext _dbContext;

        public BookingManager(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public IEnumerable<ConferenceRoom> GetAvailableRooms(DateTimeOffset atTime)
        {
            return _dbContext.ConferenceRooms.Where(room =>
                !_dbContext.Bookings.Any(b =>
                    b.RoomId == room.Id &&
                    b.Status == BookingStatus.Confirmed &&
                    b.StartTime <= atTime &&
                    atTime < b.EndTime
                )
            ).ToList();
        }

        public Booking? GetActiveBookingForRoom(
            int roomId,
            DateTimeOffset atTime)
        {
            return _dbContext.Bookings.FirstOrDefault(b =>
                b.RoomId == roomId &&
                b.Status == BookingStatus.Confirmed &&
                b.StartTime <= atTime &&
                atTime < b.EndTime
            );
        }

        public Booking? GetNextBookingForRoom(int roomId, DateTimeOffset atTime)
        {
            return _dbContext.Bookings
                .Where(b => b.RoomId == roomId && b.StartTime > atTime)
                .OrderBy(b => b.StartTime)
                .FirstOrDefault();
        }

        public async Task<Resulting<Booking>> CreateBookingAsync(
            int bookingId,
            int roomId,
            string requestedBy,
            DateTimeOffset startTime,
            TimeSpan duration,
            RoomLocation location,
            int capacity)
        {
            if (!await _dbContext.ConferenceRooms.AnyAsync(r => r.Id == roomId))
            {
                return Resulting<Booking>.Failure("Room does not exist.");
            }

            var room = await _dbContext.ConferenceRooms.FirstOrDefaultAsync(r => r.Id == roomId);
            if (room == null)
            {
                throw new InvalidOperationException("Room cannot be null when creating a booking.");
            }

            var endTime = startTime + duration;

            // Check for overlapping bookings - load to memory first to avoid EF Core translation issues
            var conflictingBookings = await _dbContext.Bookings
                .Where(b => b.RoomId == roomId)
                .ToListAsync();

            var hasConflict = conflictingBookings
                .Where(b => b.Status == BookingStatus.Confirmed)
                .Any(b => b.EndTime > startTime && b.StartTime < endTime);

            if (hasConflict)
            {
                return Resulting<Booking>.Failure("Room is not available during the requested time.");
            }

            var booking = new Booking(
                bookingId,
                room,
                requestedBy,
                startTime,
                endTime,
                BookingStatus.Confirmed,
                location,
                capacity
            );

            await _dbContext.Bookings.AddAsync(booking);
            await _dbContext.SaveChangesAsync();
            return Resulting<Booking>.Success(booking);
        }

        public async Task LoadBookingsAsync(string filePath)
        {
            if (!File.Exists(filePath)) return;

            var json = await File.ReadAllTextAsync(filePath);
            var bookings = JsonSerializer.Deserialize<List<BookingRecord>>(json);

            foreach (var record in bookings ?? Enumerable.Empty<BookingRecord>())
            {
                var room = _dbContext.ConferenceRooms.FirstOrDefault(r => r.Id == record.RoomId);
                if (room == null)
                {
                    throw new InvalidOperationException("Room not found.");
                }

                _dbContext.Bookings.Add(new Booking(
                    record.Id,
                    room,
                    record.RequestedBy,
                    record.StartTime,
                    record.EndTime,
                    record.Status,
                    room.Location, // Use room's location
                    10 // Default capacity for legacy migration data
                ));
            }
        }

        public async Task SaveBookingsAsync(string filePath)
        {
            var records = _dbContext.Bookings.Select(b => new BookingRecord
            {
                Id = b.Id,
                RoomId = b.RoomId,
                RequestedBy = b.RequestedBy,
                StartTime = b.StartTime,
                EndTime = b.EndTime,
                Status = (ConferenceBooking.API.Entities.BookingStatus)b.Status
            });

            var json = JsonSerializer.Serialize(records);
            await File.WriteAllTextAsync(filePath, json);
        }

        public async Task<IReadOnlyList<Booking>> GetAllBookingsAsync()
        {
            return await _dbContext.Bookings.ToListAsync();
        }

        public void CancelBooking(int bookingId)
        {
            var booking = _dbContext.Bookings.FirstOrDefault(b => b.Id == bookingId);
            if (booking == null)
                throw new ArgumentException("Booking not found.");

            if (booking.Status == BookingStatus.Cancelled)
                throw new InvalidOperationException("Booking is already cancelled.");

            booking.Status = BookingStatus.Cancelled;
        }

        public async Task CancelBookingAsync(int bookingId)
        {
            var booking = await _dbContext.Bookings.FirstOrDefaultAsync(b => b.Id == bookingId);
            if (booking == null)
                throw new ArgumentException("Booking not found.");

            if (booking.Status == BookingStatus.Cancelled)
                throw new InvalidOperationException("Booking is already cancelled.");

            booking.Status = BookingStatus.Cancelled;
            await _dbContext.SaveChangesAsync();
        }

        public bool DeleteBooking(int bookingId)
        {
            var booking = _dbContext.Bookings.FirstOrDefault(b => b.Id == bookingId);
            if (booking == null)
            {
                return false;
            }

            _dbContext.Bookings.Remove(booking);
            return true;
        }

        public ConferenceRoom GetFirstAvailableRoom(DateTimeOffset startTime)
        {
            var availableRooms = GetAvailableRooms(startTime);
            var room = availableRooms.FirstOrDefault();

            if (room == null)
            {
                throw new InvalidBookingException("No available rooms for the specified time.");
            }

            return room;
        }

        public ConferenceRoom ValidateAndGetFirstAvailableRoom(DateTimeOffset startDate, DateTimeOffset endDate)
        {
            if (endDate <= startDate)
            {
                throw new InvalidBookingException("End date must be after start date.");
            }

            return GetFirstAvailableRoom(startDate);
        }

        public ConferenceRoom? GetRoomById(int roomId)
        {
            return _dbContext.ConferenceRooms.FirstOrDefault(r => r.Id == roomId);
        }

        public async Task<ConferenceRoom?> GetRoomByIdAsync(int roomId)
        {
            return await _dbContext.ConferenceRooms.FirstOrDefaultAsync(r => r.Id == roomId);
        }

        public bool IsRoomAvailable(int roomId, DateTimeOffset atTime)
        {
            if (!_dbContext.ConferenceRooms.Any(r => r.Id == roomId)) return false;

            return !_dbContext.Bookings.Any(b => b.RoomId == roomId &&
                                   b.StartTime <= atTime &&
                                   b.EndTime >= atTime);
        }

        public async Task<bool> IsRoomAvailableAsync(int roomId, DateTimeOffset atTime)
        {
            return !await _dbContext.Bookings.AnyAsync(b =>
                b.RoomId == roomId &&
                b.Status == BookingStatus.Confirmed &&
                b.StartTime <= atTime &&
                atTime < b.EndTime);
        }

        public class Resulting
        {
            public bool IsSuccess { get; }
            public string ErrorMessage { get; }

            protected Resulting(bool isSuccess, string errorMessage)
            {
                IsSuccess = isSuccess;
                ErrorMessage = errorMessage;
            }

            public static Resulting Success() => new Resulting(true, string.Empty);
            public static Resulting Failure(string errorMessage) => new Resulting(false, errorMessage);
        }

        public class Resulting<T> : Resulting
        {
            public T Value { get; }

            private Resulting(bool isSuccess, string errorMessage, T value)
                : base(isSuccess, errorMessage)
            {
                Value = value;
            }

            public static Resulting<T> Success(T value) => new Resulting<T>(true, string.Empty, value);
            public new static Resulting<T> Failure(string errorMessage) => new Resulting<T>(false, errorMessage, default!);
        }
    }
}