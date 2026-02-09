namespace ConferenceBooking.API.Entities
{
    public class ConferenceRoom
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Capacity { get; set; }
        public int Number { get; set; } // Added property

        public ConferenceRoom(int id, string name, int capacity, int number)
        {
            Id = id;
            Name = name;
            Capacity = capacity;
            Number = number;
        }
    }
}