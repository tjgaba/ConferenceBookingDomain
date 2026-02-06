using System;

namespace ConferenceBooking.API.DTO
{
    public class GetAllBookingsDTO
    {
        // Change: Added nullable annotations to properties to handle potential null values.
        public int BookingId { get; set; }
        public string? RoomName { get; set; } // Nullable to allow missing room names.
        public string? RequestedBy { get; set; } // Nullable to allow missing requester information.
        public DateTimeOffset StartTime { get; set; }
        public DateTimeOffset EndTime { get; set; }
        public string? Status { get; set; } // Nullable to allow missing status information.
    }
}