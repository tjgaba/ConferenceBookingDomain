using System.ComponentModel.DataAnnotations;

namespace ConferenceBooking.API.DTO;

public class ChangeUserStatusDTO
{
    [Required(ErrorMessage = "User ID is required")]
    public string UserId { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "IsActive status is required")]
    public bool IsActive { get; set; }
    
    public string? Reason { get; set; } // Optional reason for status change
}
