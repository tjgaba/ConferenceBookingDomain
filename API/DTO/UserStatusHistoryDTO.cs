namespace ConferenceBooking.API.DTO;

public class UserStatusHistoryDTO
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public string UserFullName { get; set; } = string.Empty;
    public bool OldStatus { get; set; }
    public bool NewStatus { get; set; }
    public string ChangedBy { get; set; } = string.Empty;
    public DateTime ChangedAt { get; set; }
    public string? Reason { get; set; }
    public string Action { get; set; } = string.Empty;
    public string? IpAddress { get; set; }
}
