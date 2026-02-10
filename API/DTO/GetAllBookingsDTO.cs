using System;

namespace ConferenceBooking.API.DTO
{
    public class GetAllBookingsDTO
    {
        // Change: Added nullable annotations to properties to handle potential null values.
        public int BookingId { get; set; }
        public string? RoomName { get; set; } = string.Empty; // Default to empty string
        public string? RequestedBy { get; set; } = string.Empty; // Default to empty string
        public DateTimeOffset StartTime { get; set; }
        public DateTimeOffset EndTime { get; set; }
        public string? Status { get; set; } = string.Empty; // Default to empty string
    }
}