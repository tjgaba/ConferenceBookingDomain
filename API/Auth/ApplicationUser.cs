using Microsoft.AspNetCore.Identity;
using ConferenceBooking.API.Entities;
using ConferenceBooking.API.Models;
using System.ComponentModel.DataAnnotations;

namespace ConferenceBooking.API.Auth;

public class ApplicationUser : IdentityUser
{
    [Required]
    [MaxLength(100)]
    public string FirstName { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(100)]
    public string LastName { get; set; } = string.Empty;
    
    [MaxLength(100)]
    public string? Department { get; set; }
    
    [MaxLength(50)]
    public string? EmployeeNumber { get; set; }
    
    public RoomLocation? PrimaryLocation { get; set; }
    
    public RoomLocation? PreferredLocation { get; set; }
    
    [MaxLength(50)]
    public string NotificationPreferences { get; set; } = "Email"; // Email, SMS, Both, None
    
    public bool IsActive { get; set; } = true;
    
    public DateTime DateJoined { get; set; } = DateTime.UtcNow;
    
    public DateTime? LastLoginDate { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime? UpdatedAt { get; set; }
    
    public DateTime? DeletedAt { get; set; } // Soft delete - set when IsActive = false
    
    // Navigation properties
    public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
    
    // Computed property for display
    public string FullName => $"{FirstName} {LastName}";
}