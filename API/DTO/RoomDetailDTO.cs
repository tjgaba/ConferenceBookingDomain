using System;

namespace ConferenceBooking.API.DTO
{
    /// <summary>
    /// Detailed DTO for room detail views containing complete room information
    /// </summary>
    public class RoomDetailDTO
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int Capacity { get; set; }
        public int Number { get; set; }
        public string Location { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public DateTimeOffset? DeletedAt { get; set; }
    }
}
