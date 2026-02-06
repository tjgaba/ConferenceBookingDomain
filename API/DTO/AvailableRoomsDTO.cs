namespace ConferenceBooking.API.DTO;

public class AvailableRoomsDTO
{
    public int RoomId { get; set; }
    public string? RoomName { get; set; } // Marked as nullable to fix the warning
    public int Capacity { get; set; }
    public bool IsAvailable { get; set; }
}