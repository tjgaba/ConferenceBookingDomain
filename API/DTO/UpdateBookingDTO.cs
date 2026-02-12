using System;

namespace ConferenceBooking.API.DTO
{
    public class UpdateBookingDTO
    {
        public int BookingId { get; set; }
        public int? RoomId { get; set; }
        public string? RequestedBy { get; set; }
        public DateTimeOffset? StartTime { get; set; }
        public DateTimeOffset? EndTime { get; set; }
        public string? Status { get; set; }
    }
}
