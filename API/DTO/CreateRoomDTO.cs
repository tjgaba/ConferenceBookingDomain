using System.ComponentModel.DataAnnotations;
using ConferenceBooking.API.Entities;

namespace ConferenceBooking.API.DTO
{
    public class CreateRoomDTO
    {
        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Capacity must be greater than 0")]
        public int Capacity { get; set; }

        [Required]
        public int Number { get; set; }

        [Required]
        public RoomLocation Location { get; set; }

        public bool IsActive { get; set; } = true;
    }
}
