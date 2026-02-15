using System.ComponentModel.DataAnnotations;

namespace ConferenceBooking.API.DTO;

public class DeleteUserDTO
{
    [Required(ErrorMessage = "User ID is required")]
    public string UserId { get; set; } = string.Empty;
    
    public string? Reason { get; set; } // Optional reason for soft delete
}
