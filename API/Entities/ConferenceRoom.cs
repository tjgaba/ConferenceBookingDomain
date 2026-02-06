public class ConferenceRoom
{
    public int Id { get; }
    public string Name { get; }
    public int Capacity { get; }
    public int Number { get; } // Added Number property

    public ConferenceRoom(int id, string name, int capacity)
    {
        Id = id;
        Name = name;
        Capacity = capacity;
        Number = id; // Default Number to Id
    }
}