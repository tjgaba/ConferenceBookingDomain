namespace ConferenceBooking.API.Entities
{
    public class ConferenceRoom
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Capacity { get; set; }
        public int Number { get; set; }
        public RoomLocation Location { get; set; }
        public bool IsActive { get; set; } = true;

        public ConferenceRoom()
        {
            // Parameterless constructor for EF Core
            Id = 0;
            Name = string.Empty;
            Capacity = 0;
            Number = 0;
            Location = RoomLocation.London;
            IsActive = true;
        }

        public ConferenceRoom(int id, string name, int capacity, int number, RoomLocation location = RoomLocation.London, bool isActive = true)
        {
            Id = id;
            Name = name;
            Capacity = capacity;
            Number = number;
            Location = location;
            IsActive = isActive;
        }
    }
}