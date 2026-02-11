using System;
using System.ComponentModel.DataAnnotations;
using ConferenceBooking.API.Entities;

namespace ConferenceBooking.API.DTO
{
    public class CreateBookingRequestDTO
    {
        [Required]
        public int RoomId { get; set; }

        [Required]
        public DateTimeOffset StartDate { get; set; }

        [Required]
        public DateTimeOffset EndDate { get; set; }

        [Required]
        public int BookingId { get; set; }

        [Required]
        public string Location { get; set; } = string.Empty;

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Capacity must be at least 1.")]
        public int Capacity { get; set; }
    }
}