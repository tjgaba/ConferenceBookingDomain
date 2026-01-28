public class ConferenceRoom
{
    public int Id { get; }
    public string Name { get; }
    public int Capacity { get; }
    public RoomAvailability Availability { get; private set; }

    public ConferenceRoom(int id, string name, int capacity)
    {
        Id = id;
        Name = name;
        Capacity = capacity;
        Availability = RoomAvailability.Available;
    }

    public void MarkUnavailable()
    {
        Availability = RoomAvailability.Unavailable;
    }

    public void MarkAvailable()
    {
        Availability = RoomAvailability.Available;
    }
}
