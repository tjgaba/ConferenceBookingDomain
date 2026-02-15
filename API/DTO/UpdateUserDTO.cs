using System.ComponentModel.DataAnnotations;
using ConferenceBooking.API.Entities;

namespace ConferenceBooking.API.DTO;

public class UpdateUserDTO
{
    [Required(ErrorMessage = "User ID is required")]
    public string UserId { get; set; } = string.Empty;
    
    [MaxLength(100)]
    public string? FirstName { get; set; }
    
    [MaxLength(100)]
    public string? LastName { get; set; }
    
    [EmailAddress(ErrorMessage = "Invalid email format")]
    public string? Email { get; set; }
    
    [Phone(ErrorMessage = "Invalid phone number format")]
    public string? PhoneNumber { get; set; }
    
    [MaxLength(100)]
    public string? Department { get; set; }
    
    [MaxLength(50)]
    public string? EmployeeNumber { get; set; }
    
    public RoomLocation? PrimaryLocation { get; set; }
    
    public RoomLocation? PreferredLocation { get; set; }
    
    public string? NotificationPreferences { get; set; }
    
    public string? Role { get; set; } // Optional role update
}
