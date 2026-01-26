namespace ConferenceRoomBooking
{
    public class ConferenceRoom
    {
        public int Id { get; }
        public string Name { get; }
        public int Capacity { get; }
        public RoomAvailability Availability { get; private set; }

            public ConferenceRoom(int id, string name, int capacity, RoomAvailability availability)
            {
                Id = id;
                Name = name;
                Capacity = capacity;
                Availability = availability;
            }

        
    }
}
