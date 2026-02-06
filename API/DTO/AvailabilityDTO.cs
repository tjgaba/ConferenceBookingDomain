namespace ConferenceBooking.API.DTO;

public class AvailabilityDTO
{
    public int RoomId { get; set; }
    public string RoomName { get; set; }
    public bool IsAvailable { get; set; }
}