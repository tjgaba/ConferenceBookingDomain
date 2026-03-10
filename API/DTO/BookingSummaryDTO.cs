using System;

namespace ConferenceBooking.API.DTO
{
    /// <summary>
    /// Summary DTO for booking list views containing only essential information
    /// </summary>
    public class BookingSummaryDTO
    {
        public int BookingId { get; set; }
        public string RoomName { get; set; } = string.Empty;
        public DateTimeOffset Date { get; set; }
        public DateTimeOffset StartTime { get; set; }
        public DateTimeOffset EndTime { get; set; }
        public string Location { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public string Status { get; set; } = string.Empty;
    }
}
