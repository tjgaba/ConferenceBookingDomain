using System.ComponentModel.DataAnnotations;
using ConferenceBooking.API.Entities;

namespace ConferenceBooking.API.DTO
{
    public class UpdateRoomDTO
    {
        public string? Name { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "Capacity must be greater than 0")]
        public int? Capacity { get; set; }

        public int? Number { get; set; }

        public RoomLocation? Location { get; set; }
    }
}
