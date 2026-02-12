using System;
using System.ComponentModel.DataAnnotations;

namespace ConferenceBooking.API.DTO
{
    public class UpdateSessionDTO
    {
        [Required]
        public int Id { get; set; }
        
        [Required(ErrorMessage = "Title is required")]
        public string Title { get; set; } = string.Empty;
        
        public string? Description { get; set; }
        
        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Capacity must be at least 1")]
        public int Capacity { get; set; }
        
        [Required]
        public DateTimeOffset StartTime { get; set; }
        
        [Required]
        public DateTimeOffset EndTime { get; set; }
        
        public int? RoomId { get; set; }
    }
}
