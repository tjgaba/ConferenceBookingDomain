using ConferenceBooking.API.Entities;

namespace ConferenceBooking.API.DTO;

public class UserResponseDTO
{
    public string Id { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public string? Department { get; set; }
    public string? EmployeeNumber { get; set; }
    public RoomLocation? PrimaryLocation { get; set; }
    public RoomLocation? PreferredLocation { get; set; }
    public string NotificationPreferences { get; set; } = "Email";
    public bool IsActive { get; set; }
    public List<string> Roles { get; set; } = new List<string>();
    public DateTime DateJoined { get; set; }
    public DateTime? LastLoginDate { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }
}
