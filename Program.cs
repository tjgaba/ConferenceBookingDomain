using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ConferenceRoomBooking
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Enter room number");
            int roomNumber = int.Parse(Console.ReadLine());

            Console.WriteLine("Enter your name");
            string yourName = Console.ReadLine();

            // Create a conference room
            ConferenceRoom room = new ConferenceRoom(
                id: 1,
                name: "Conference Room 1",
                capacity: 10,
                availability: RoomAvailability.Available
            );

            // Create a booking
            Booking booking = new Booking(
                id: roomNumber,
                room: room,
                requestedBy: yourName
            );

            // Confirm once
            booking.Confirm();
            Console.WriteLine($"Thank you {yourName} for booking: {room.Name} ID: {roomNumber}. Your Booking Status is {booking.Status}");

        }
    }
}
