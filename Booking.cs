using System;

namespace ConferenceRoomBooking
{
    public class Booking
    {
        public int Id { get; }
        public ConferenceRoom Room { get; }
        public string RequestedBy { get; }
        public BookingStatus Status { get; private set; }

        public Booking(int id, ConferenceRoom room, string requestedBy)
        {
            Id = id;
            Room = room;
            RequestedBy = requestedBy;
            Status = BookingStatus.Pending;
        }

    }
}
