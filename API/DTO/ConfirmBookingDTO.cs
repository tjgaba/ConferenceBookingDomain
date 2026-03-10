using System.ComponentModel.DataAnnotations;

namespace ConferenceBooking.API.DTO
{
    public class ConfirmBookingDTO
    {
        [Required]
        public int BookingId { get; set; }
    }
}
