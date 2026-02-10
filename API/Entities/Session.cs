using System;
using System.ComponentModel.DataAnnotations;

namespace ConferenceBooking.API.Entities
{
    public class Session
    {
        public int Id { get; set; }
        
        [Required]
        public string Title { get; set; }
        
        public string? Description { get; set; }
        
        [Range(1, int.MaxValue, ErrorMessage = "Capacity must be a positive value.")]
        public int Capacity { get; set; }
        
        [Required]
        public DateTimeOffset StartTime { get; set; }
        
        [Required]
        public DateTimeOffset EndTime { get; set; }
        
        public int? RoomId { get; set; }
        public ConferenceRoom? Room { get; set; }
        
        public Session()
        {
            Title = string.Empty;
        }
        
        public Session(string title, int capacity, DateTimeOffset startTime, DateTimeOffset endTime)
        {
            if (capacity <= 0)
                throw new ArgumentException("Capacity must be a positive value.", nameof(capacity));
                
            if (endTime <= startTime)
                throw new ArgumentException("End time must be after start time.", nameof(endTime));
            
            Title = title;
            Capacity = capacity;
            StartTime = startTime;
            EndTime = endTime;
        }
        
        public bool IsValid()
        {
            return Capacity > 0 && EndTime > StartTime && !string.IsNullOrWhiteSpace(Title);
        }
    }
}
