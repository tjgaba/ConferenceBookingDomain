using System;
using System.Collections.Generic;
using System.Linq;

class Program
{
    // ORDERED COLLECTION:
    // Used for display and initialization
    private static readonly List<ConferenceRoom> Rooms = new()
    {
        new ConferenceRoom(1, "Room 1", 5),
        new ConferenceRoom(2, "Room 2", 10),
        new ConferenceRoom(3, "Room 3", 15),
        new ConferenceRoom(4, "Room 4", 20),
        new ConferenceRoom(5, "Room 5", 25),
    };

    // ORDERED COLLECTION:
    // Stores all bookings created during runtime
    private static readonly List<Booking> Bookings = new();

    private static int _bookingIdCounter = 1;

    static void Main(string[] args)
    {
        // BUSINESS LOGIC IS CENTRALIZED HERE
        var bookingService = new BookingService(Rooms, Bookings);

        while (true)
        {
            Console.Clear();
            Console.WriteLine("=== Conference Room Booking System ===");
            Console.WriteLine("Select an option: ");
            Console.WriteLine("1. Book a room");
            Console.WriteLine("2. View room availability");
            Console.WriteLine("3. Cancel a booking");
            Console.WriteLine("0. Exit");
            

            var choice = Console.ReadLine();

            switch (choice)
            {
                case "1":
                    BookRoom(bookingService);
                    break;

                case "2":
                    ViewAvailability(bookingService);
                    break;

                case "3":
                    CancelBooking(bookingService);
                    break;

                case "0":
                    return;

                default:
                    Console.WriteLine("Invalid option.");
                    Console.WriteLine("Press ENTER to exit");
                    Console.ReadKey();
                    break;
            }
        }
    }

    private static void BookRoom(BookingService bookingService)
    {
        Console.Clear();

        Console.Write("Enter your name: ");
        var requestedBy = Console.ReadLine();

        var now = DateTime.Now;

        // DELEGATION:
        // Program.cs does not decide availability
        var availableRooms = bookingService
            .GetAvailableRooms(now)
            .ToList();

        if (!availableRooms.Any())
        {
            Console.WriteLine("No rooms available.");
            Console.WriteLine("Press ENTER to exit");
            Console.ReadKey();
            return;
        }

        Console.WriteLine("\nAvailable Rooms:");
        foreach (var room in availableRooms)
        {
            Console.WriteLine($"{room.Id}. {room.Name} (Capacity: {room.Capacity})");
        }

        Console.Write("\nSelect room number: ");
        if (!int.TryParse(Console.ReadLine(), out var roomId))
        {
            Console.WriteLine("Invalid input.");
            Console.WriteLine("Press ENTER to exit");
            Console.ReadKey();
            return;
        }

        try
        {
            // AUTOMATIC TIME CAPTURE
            var startTime = now;
            var endTime = startTime.AddHours(1);

            // BUSINESS DECISION DELEGATED TO SERVICE
            var booking = bookingService.CreateBooking(
                _bookingIdCounter++,
                roomId,
                requestedBy,
                startTime,
                endTime
            );

            Console.WriteLine(
                $"Booking confirmed!\n" +
                $"Room: {booking.Room.Name}\n" +
                $"Time: {booking.StartTime:t} - {booking.EndTime:t}\n" +
                $"Booking ID: {booking.Id}"
            );
        }
        catch (Exception ex)
        {
            // USER FEEDBACK ONLY — NOT BUSINESS LOGIC
            Console.WriteLine(ex.Message);
        }
        Console.WriteLine("Press ENTER to exit");

        Console.ReadKey();
    }

    private static void ViewAvailability(BookingService bookingService)
    {
        Console.Clear();
        Console.WriteLine("Room Availability:\n");

        var now = DateTime.Now;
        var availableRooms = bookingService
            .GetAvailableRooms(now)
            .Select(r => r.Id)
            .ToHashSet();

        foreach (var room in Rooms)
        {
            Console.WriteLine(
                $"{room.Name} | Capacity: {room.Capacity} | " +
                $"Status: {(availableRooms.Contains(room.Id) ? "Available" : "Unavailable")}"
            );
        }
        Console.WriteLine("Press ENTER to exit");

        Console.ReadKey();
    }

    private static void CancelBooking(BookingService bookingService)
    {
        Console.Clear();

        // BUSINESS QUERY DELEGATED TO SERVICE
        var activeBookings = bookingService
            .GetActiveBookings()
            .ToList();

        if (!activeBookings.Any())
        {
            Console.WriteLine("There are no active bookings to cancel.");
            Console.WriteLine("Press ENTER to exit");
            Console.ReadKey();
            return;
        }

        Console.WriteLine("Active Bookings:\n");
        foreach (var booking in activeBookings)
        {
            Console.WriteLine(
                $"ID: {booking.Id} | " +
                $"Room: {booking.Room.Name} | " +
                $"Time: {booking.StartTime:t} - {booking.EndTime:t} | " +
                $"Requested By: {booking.RequestedBy}"
            );
        }

        Console.Write("\nEnter Booking ID to cancel: ");
        if (!int.TryParse(Console.ReadLine(), out var bookingId))
        {
            Console.WriteLine("Invalid input.");
            Console.WriteLine("Press ENTER to exit");
            Console.ReadKey();
            return;
        }

        var bookingToCancel = activeBookings.FirstOrDefault(b => b.Id == bookingId);
        if (bookingToCancel == null)
        {
            Console.WriteLine("Booking not found.");
            Console.WriteLine("Press ENTER to exit");
            Console.ReadKey();
            return;
        }

        // DOMAIN STATE CHANGE
        bookingToCancel.Cancel();
        Console.WriteLine("Booking cancelled successfully.");
        Console.WriteLine("Press ENTER to exit");
        Console.ReadKey();
    }
}
