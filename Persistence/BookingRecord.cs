using System;

namespace ConferenceBooking.Persistence
{
    internal sealed class BookingRecord
    {
        public int Id { get; set; }
        public int RoomId { get; set; }
        public string RequestedBy { get; set; } = string.Empty;
        public DateTimeOffset StartTime { get; set; }
        public DateTimeOffset EndTime { get; set; }
        public BookingStatus Status { get; set; }
    }
}
