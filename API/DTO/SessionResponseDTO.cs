using System;

namespace ConferenceBooking.API.DTO
{
    public class SessionResponseDTO
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int Capacity { get; set; }
        public DateTimeOffset StartTime { get; set; }
        public DateTimeOffset EndTime { get; set; }
        public int? RoomId { get; set; }
        public string? RoomName { get; set; }
        public string? RoomLocation { get; set; }
    }
}
