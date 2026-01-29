using System.Collections.Generic;

public static class ConferenceRoomRepository
{
    // BACK-END DATA SOURCE:
    // Central definition of available conference rooms
    public static List<ConferenceRoom> GetRooms()
    {
        return new List<ConferenceRoom>
        {
            new ConferenceRoom(1, "Room 1", 5),
            new ConferenceRoom(2, "Room 2", 10),
            new ConferenceRoom(3, "Room 3", 15),
            new ConferenceRoom(4, "Room 4", 20),
            new ConferenceRoom(5, "Room 5", 25),
        };
    }
}
