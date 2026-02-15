namespace ConferenceBooking.API.DTO;

public class GetAllUsersDTO
{
    public bool? IsActive { get; set; } // null = all, true = active only, false = inactive only
    public string? Role { get; set; } // Filter by role
    public string? Department { get; set; } // Filter by department
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 50;
}
