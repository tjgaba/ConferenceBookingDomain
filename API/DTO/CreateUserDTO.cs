using System.ComponentModel.DataAnnotations;
using ConferenceBooking.API.Entities;

namespace ConferenceBooking.API.DTO;

public class CreateUserDTO
{
    [Required(ErrorMessage = "First name is required")]
    [MaxLength(100)]
    public string FirstName { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "Last name is required")]
    [MaxLength(100)]
    public string LastName { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Invalid email format")]
    public string Email { get; set; } = string.Empty;
    
    [Phone(ErrorMessage = "Invalid phone number format")]
    public string? PhoneNumber { get; set; }
    
    [Required(ErrorMessage = "Password is required")]
    [MinLength(6, ErrorMessage = "Password must be at least 6 characters")]
    public string Password { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "Role is required")]
    public string Role { get; set; } = string.Empty; // Admin, FacilityManager, Receptionist, Employee
    
    [MaxLength(100)]
    public string? Department { get; set; }
    
    [MaxLength(50)]
    public string? EmployeeNumber { get; set; }
    
    public RoomLocation? PrimaryLocation { get; set; }
    
    public RoomLocation? PreferredLocation { get; set; }
    
    public string NotificationPreferences { get; set; } = "Email"; // Email, SMS, Both, None
}
