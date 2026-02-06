using System;

namespace ConferenceBooking.API.DTO
{
    public class GetAllBookingsDTO
    {
        public int BookingId { get; set; }
        public string RoomName { get; set; }
        public string RequestedBy { get; set; }
        public DateTimeOffset StartTime { get; set; }
        public DateTimeOffset EndTime { get; set; }
        public string Status { get; set; }
    }
}