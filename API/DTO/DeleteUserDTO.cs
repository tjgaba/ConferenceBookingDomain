using System.ComponentModel.DataAnnotations;

namespace ConferenceBooking.API.DTO;

public class DeleteUserDTO
{
    public string? Reason { get; set; } // Optional reason for soft delete
}
