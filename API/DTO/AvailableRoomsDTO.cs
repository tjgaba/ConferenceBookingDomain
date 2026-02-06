namespace ConferenceBooking.API.DTO;

public class AvailableRoomsDTO
{
    public int RoomId { get; set; }
    public string RoomName { get; set; }
    public int Capacity { get; set; }
    public bool IsAvailable { get; set; }
}