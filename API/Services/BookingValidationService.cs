using System;
using System.Linq;
using System.Threading.Tasks;
using ConferenceBooking.API.Entities;
using ConferenceBooking.API.Models;
using Microsoft.EntityFrameworkCore;

namespace ConferenceBooking.API.Services
{
    /// <summary>
    /// Service layer for enforcing booking domain rules and business logic.
    /// All data integrity rules are enforced here, NOT in controllers.
    /// </summary>
    public class BookingValidationService
    {
        private readonly ApplicationDbContext _dbContext;

        // Business hours: 08:00 AM to 4:00 PM
        private const int BusinessHoursStart = 8;
        private const int BusinessHoursEnd = 16;

        public BookingValidationService(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        /// <summary>
        /// DOMAIN RULE: Prevents booking inactive/deleted rooms
        /// Validates that the room exists and is active
        /// </summary>
        public async Task<(bool isValid, string? errorMessage, ConferenceRoom? room)> ValidateRoomAvailabilityAsync(int roomId)
        {
            var room = await _dbContext.ConferenceRooms.FirstOrDefaultAsync(r => r.Id == roomId);
            
            if (room == null)
            {
                return (false, "Room does not exist.", null);
            }

            if (!room.IsActive)
            {
                return (false, "This room is not currently available for booking. The room has been deactivated.", null);
            }

            return (true, null, room);
        }

        /// <summary>
        /// DOMAIN RULE: Prevents invalid date ranges
        /// Validates that start time is before end time
        /// </summary>
        public (bool isValid, string? errorMessage) ValidateDateRange(DateTimeOffset startTime, DateTimeOffset endTime)
        {
            if (startTime >= endTime)
            {
                return (false, "Invalid date range: Start time must be before end time.");
            }

            return (true, null);
        }

        /// <summary>
        /// DOMAIN RULE: Prevents bookings outside valid business hours (08:00 - 16:00)
        /// Validates that both start and end times fall within business hours
        /// </summary>
        public (bool isValid, string? errorMessage) ValidateBusinessHours(DateTimeOffset startTime, DateTimeOffset endTime)
        {
            // Extract hour component (0-23)
            var startHour = startTime.Hour;
            var endHour = endTime.Hour;

            // Check if start time is within business hours
            if (startHour < BusinessHoursStart || startHour >= BusinessHoursEnd)
            {
                return (false, $"Booking start time must be between {BusinessHoursStart:00}:00 and {BusinessHoursEnd:00}:00. Provided start time: {startTime:HH:mm}");
            }

            // Check if end time is within business hours
            // End time can be exactly at 16:00 but not after
            if (endHour > BusinessHoursEnd || (endHour == BusinessHoursEnd && endTime.Minute > 0))
            {
                return (false, $"Booking end time must be at or before {BusinessHoursEnd:00}:00. Provided end time: {endTime:HH:mm}");
            }

            return (true, null);
        }

        /// <summary>
        /// DOMAIN RULE: Prevents double bookings
        /// Validates that no confirmed bookings overlap with the requested time slot
        /// </summary>
        public async Task<(bool isValid, string? errorMessage)> ValidateNoDoubleBookingAsync(
            int roomId, 
            DateTimeOffset startTime, 
            DateTimeOffset endTime,
            int? excludeBookingId = null)
        {
            // Get all confirmed bookings for this room
            var query = _dbContext.Bookings
                .AsNoTracking()
                .Where(b => b.RoomId == roomId && b.Status == BookingStatus.Confirmed);

            // If updating an existing booking, exclude it from the conflict check
            if (excludeBookingId.HasValue)
            {
                query = query.Where(b => b.Id != excludeBookingId.Value);
            }

            var confirmedBookings = await query.ToListAsync();

            // Check for time overlap
            // Two bookings overlap if: booking1.end > booking2.start AND booking1.start < booking2.end
            var hasConflict = confirmedBookings.Any(b => b.EndTime > startTime && b.StartTime < endTime);

            if (hasConflict)
            {
                return (false, "Room is not available during the requested time. There is a conflicting booking.");
            }

            return (true, null);
        }

        /// <summary>
        /// DOMAIN RULE: Prevent bookings that span multiple days
        /// Validates that booking starts and ends on the same day
        /// </summary>
        public (bool isValid, string? errorMessage) ValidateSameDay(DateTimeOffset startTime, DateTimeOffset endTime)
        {
            if (startTime.Date != endTime.Date)
            {
                return (false, "Bookings must start and end on the same day. Multi-day bookings are not allowed.");
            }

            return (true, null);
        }

        /// <summary>
        /// DOMAIN RULE: Validates booking capacity
        /// Ensures requested capacity doesn't exceed room capacity
        /// </summary>
        public (bool isValid, string? errorMessage) ValidateCapacity(int requestedCapacity, int roomCapacity)
        {
            if (requestedCapacity <= 0)
            {
                return (false, "Booking capacity must be at least 1 person.");
            }

            if (requestedCapacity > roomCapacity)
            {
                return (false, $"Requested capacity ({requestedCapacity}) exceeds room capacity ({roomCapacity}).");
            }

            return (true, null);
        }

        /// <summary>
        /// COMPREHENSIVE VALIDATION: Validates all domain rules for a new booking
        /// Enforces all data integrity rules in one method
        /// </summary>
        public async Task<(bool isValid, string? errorMessage, ConferenceRoom? room)> ValidateBookingCreationAsync(
            int roomId,
            DateTimeOffset startTime,
            DateTimeOffset endTime,
            int capacity)
        {
            // RULE 1: Validate date range (start before end)
            var dateRangeValidation = ValidateDateRange(startTime, endTime);
            if (!dateRangeValidation.isValid)
            {
                return (false, dateRangeValidation.errorMessage, null);
            }

            // RULE 2: Validate same day
            var sameDayValidation = ValidateSameDay(startTime, endTime);
            if (!sameDayValidation.isValid)
            {
                return (false, sameDayValidation.errorMessage, null);
            }

            // RULE 3: Validate business hours (08:00 - 16:00)
            var businessHoursValidation = ValidateBusinessHours(startTime, endTime);
            if (!businessHoursValidation.isValid)
            {
                return (false, businessHoursValidation.errorMessage, null);
            }

            // RULE 4: Validate room exists and is active
            var roomValidation = await ValidateRoomAvailabilityAsync(roomId);
            if (!roomValidation.isValid)
            {
                return (false, roomValidation.errorMessage, null);
            }

            var room = roomValidation.room!;

            // RULE 5: Validate capacity
            var capacityValidation = ValidateCapacity(capacity, room.Capacity);
            if (!capacityValidation.isValid)
            {
                return (false, capacityValidation.errorMessage, null);
            }

            // RULE 6: Prevent double bookings
            var doubleBookingValidation = await ValidateNoDoubleBookingAsync(roomId, startTime, endTime);
            if (!doubleBookingValidation.isValid)
            {
                return (false, doubleBookingValidation.errorMessage, null);
            }

            // All validations passed
            return (true, null, room);
        }

        /// <summary>
        /// COMPREHENSIVE VALIDATION: Validates all domain rules for updating a booking
        /// </summary>
        public async Task<(bool isValid, string? errorMessage, ConferenceRoom? room)> ValidateBookingUpdateAsync(
            int bookingId,
            int roomId,
            DateTimeOffset startTime,
            DateTimeOffset endTime,
            int capacity)
        {
            // RULE 1: Validate date range (start before end)
            var dateRangeValidation = ValidateDateRange(startTime, endTime);
            if (!dateRangeValidation.isValid)
            {
                return (false, dateRangeValidation.errorMessage, null);
            }

            // RULE 2: Validate same day
            var sameDayValidation = ValidateSameDay(startTime, endTime);
            if (!sameDayValidation.isValid)
            {
                return (false, sameDayValidation.errorMessage, null);
            }

            // RULE 3: Validate business hours (08:00 - 16:00)
            var businessHoursValidation = ValidateBusinessHours(startTime, endTime);
            if (!businessHoursValidation.isValid)
            {
                return (false, businessHoursValidation.errorMessage, null);
            }

            // RULE 4: Validate room exists and is active
            var roomValidation = await ValidateRoomAvailabilityAsync(roomId);
            if (!roomValidation.isValid)
            {
                return (false, roomValidation.errorMessage, null);
            }

            var room = roomValidation.room!;

            // RULE 5: Validate capacity
            var capacityValidation = ValidateCapacity(capacity, room.Capacity);
            if (!capacityValidation.isValid)
            {
                return (false, capacityValidation.errorMessage, null);
            }

            // RULE 6: Prevent double bookings (exclude current booking from conflict check)
            var doubleBookingValidation = await ValidateNoDoubleBookingAsync(roomId, startTime, endTime, bookingId);
            if (!doubleBookingValidation.isValid)
            {
                return (false, doubleBookingValidation.errorMessage, null);
            }

            // All validations passed
            return (true, null, room);
        }
    }
}
