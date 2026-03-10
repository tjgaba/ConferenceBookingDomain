using System;

namespace ConferenceBooking.API.DTO
{
    /// <summary>
    /// Detailed DTO for booking detail views containing complete booking information
    /// </summary>
    public class BookingDetailDTO
    {
        public int BookingId { get; set; }
        public int RoomId { get; set; }
        public string RoomName { get; set; } = string.Empty;
        public int RoomNumber { get; set; }
        public string Location { get; set; } = string.Empty;
        public bool IsRoomActive { get; set; }
        public string RequestedBy { get; set; } = string.Empty;
        public DateTimeOffset StartTime { get; set; }
        public DateTimeOffset EndTime { get; set; }
        public string Status { get; set; } = string.Empty;
        public int Capacity { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset? CancelledAt { get; set; }
    }
}
