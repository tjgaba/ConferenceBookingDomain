using System;
using System.ComponentModel.DataAnnotations;

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
    }
}