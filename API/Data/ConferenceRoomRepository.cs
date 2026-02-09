using System.Collections.Generic;
using ConferenceBooking.API.Entities;

namespace ConferenceBooking.API.Data
{
    public static class ConferenceRoomRepository
    {
        // BACK-END DATA SOURCE:
        // Central definition of available conference rooms
        public static List<ConferenceRoom> GetRooms()
        {
            return new List<ConferenceRoom>
            {
                new ConferenceRoom(1, "Room 1", 5, 101),
                new ConferenceRoom(2, "Room 2", 10, 102),
                new ConferenceRoom(3, "Room 3", 15, 103),
                new ConferenceRoom(4, "Room 4", 20, 104),
                new ConferenceRoom(5, "Room 5", 25, 105),
            };
        }
    }
}
