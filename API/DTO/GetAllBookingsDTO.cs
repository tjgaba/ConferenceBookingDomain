using System;

namespace ConferenceBooking.API.DTO
{
    public class GetAllBookingsDTO
    {
        // Change: Added nullable annotations to properties to handle potential null values.
        public int BookingId { get; set; }
        public string? RoomName { get; set; } = string.Empty; // Default to empty string
        public int RoomNumber { get; set; }
        public string? Location { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public string? RequestedBy { get; set; } = string.Empty; // Default to empty string
        public DateTimeOffset StartTime { get; set; }
        public DateTimeOffset EndTime { get; set; }
        public string? Status { get; set; } = string.Empty; // Default to empty string
        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset? CancelledAt { get; set; }
    }
}