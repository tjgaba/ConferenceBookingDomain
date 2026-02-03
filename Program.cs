using System;
using System.Collections.Generic;
using System.Linq;

class Program
{
    private static int _bookingIdCounter = 1;

    static void Main(string[] args)
    {
        var rooms = ConferenceRoomRepository.GetRooms();
        var bookings = new List<Booking>();
        var bookingService = new BookingService(rooms, bookings);

        while (true)
        {
            Console.Clear();
            Console.WriteLine("=== Conference Room Booking System ===");
            Console.WriteLine("1. Book a room");
            Console.WriteLine("2. View room availability");
            Console.WriteLine("3. Cancel a booking");
            Console.WriteLine("0. Exit");
            Console.Write("Select an option: ");

            var choice = Console.ReadLine();

            switch (choice)
            {
                case "1":
                    BookRoom(bookingService, rooms);
                    break;
                case "2":
                    ViewAvailability(bookingService, rooms);
                    break;
                case "3":
                    CancelBooking(bookingService);
                    break;
                case "0":
                    return;
                default:
                    Console.WriteLine("Invalid option.");
                    Console.ReadKey();
                    break;
            }
        }
    }

    // ---------------- BOOK ROOM ----------------

    private static void BookRoom(
        BookingService bookingService,
        List<ConferenceRoom> rooms)
    {
        Console.Clear();

        Console.Write("Enter your name: ");
        var requestedBy = Console.ReadLine();

        if (string.IsNullOrWhiteSpace(requestedBy))
        {
            Console.WriteLine("Error: Name cannot be empty.");
            Console.ReadKey();
            return;
        }

        Console.WriteLine("\nAvailable Rooms:");
        foreach (var room in rooms)
            Console.WriteLine($"{room.Id}. {room.Name} (Capacity: {room.Capacity})");

        Console.Write("\nSelect Room ID: ");
        var input = Console.ReadLine();
        if (string.IsNullOrWhiteSpace(input)) return;

        if (!int.TryParse(input, out var roomId) || !rooms.Any(r => r.Id == roomId))
        {
            Console.WriteLine("Error: Selected room does not exist.");
            Console.WriteLine("Press 'Enter' to exit or select a correct room ID.");

            input = Console.ReadLine();
            if (string.IsNullOrWhiteSpace(input) || !int.TryParse(input, out roomId) || !rooms.Any(r => r.Id == roomId))
                return;
        }

        Console.WriteLine("\nEnter meeting start date & time:");
        if (!TryReadDateTimeOffset(out var startTime))
            return;

        Console.Write("Enter meeting duration (minutes): ");
        if (!int.TryParse(Console.ReadLine(), out var minutes) || minutes <= 0)
            return;

        try
        {
            var booking = bookingService.CreateBooking(
                _bookingIdCounter++,
                roomId,
                requestedBy,
                startTime,
                TimeSpan.FromMinutes(minutes)
            );

            Console.WriteLine("\nBooking confirmed!");
            Console.WriteLine($"Room: {booking.Room.Name}");
            Console.WriteLine($"Start: {booking.StartTime}");
            Console.WriteLine($"End:   {booking.EndTime}");
            Console.WriteLine($"Booking ID: {booking.Id}");
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
        }

        Console.ReadKey();
    }

    // ---------------- VIEW AVAILABILITY ----------------

    private static void ViewAvailability(
        BookingService bookingService,
        List<ConferenceRoom> rooms)
    {
        Console.Clear();

        // Default view: availability right now
        ShowAvailabilityTable(bookingService, rooms, DateTimeOffset.Now);

        Console.WriteLine();
        Console.Write("Do you want to check availability for a specific date and time? (yes/no): ");
        var answer = Console.ReadLine()?.Trim().ToLower();

        if (answer == "yes" || answer == "y")
        {
            Console.WriteLine("\nEnter date & time:");
            if (!TryReadDateTimeOffset(out var selectedTime))
                return;

            Console.Clear();
            ShowAvailabilityTable(bookingService, rooms, selectedTime);
        }

        Console.ReadKey();
    }

    private static void ShowAvailabilityTable(
        BookingService bookingService,
        List<ConferenceRoom> rooms,
        DateTimeOffset atTime)
    {
        Console.WriteLine($"Room Availability at {atTime}");
        Console.WriteLine("------------------------------------------------------------------------------------");
        Console.WriteLine("Room    | Capacity | Status       | Booking / Availability");
        Console.WriteLine("------------------------------------------------------------------------------------");

        foreach (var room in rooms)
        {
            var activeBooking =
                bookingService.GetActiveBookingForRoom(room.Id, atTime);

            if (activeBooking != null)
            {
                var duration = activeBooking.EndTime - activeBooking.StartTime;

                Console.WriteLine(
                    $"{room.Name,-7} | {room.Capacity,8} | Unavailable  | " +
                    $"{activeBooking.StartTime:t} → {activeBooking.EndTime:t} " +
                    $"({duration.TotalMinutes} mins)"
                );
            }
            else
            {
                var nextBooking =
                    bookingService.GetNextBookingForRoom(room.Id, atTime);

                if (nextBooking == null)
                {
                    Console.WriteLine(
                        $"{room.Name,-7} | {room.Capacity,8} | Available    | " +
                        "Available (no upcoming bookings)"
                    );
                }
                else
                {
                    Console.WriteLine(
                        $"{room.Name,-7} | {room.Capacity,8} | Available    | " +
                        $"Available until {nextBooking.StartTime:t}"
                    );
                }
            }
        }
    }

    // ---------------- CANCEL BOOKING ----------------

    private static void CancelBooking(BookingService bookingService)
    {
        Console.Clear();

        var activeBookings = bookingService.GetActiveBookings().ToList();
        if (!activeBookings.Any())
        {
            Console.WriteLine("No active bookings to cancel.");
            Console.ReadKey();
            return;
        }

        Console.WriteLine("Active Bookings:\n");
        foreach (var booking in activeBookings)
        {
            Console.WriteLine(
                $"ID: {booking.Id} | Room: {booking.Room.Name} | " +
                $"Time: {booking.StartTime} - {booking.EndTime}"
            );
        }

        Console.Write("\nEnter Booking ID to cancel: ");
        if (!int.TryParse(Console.ReadLine(), out var bookingId))
            return;

        var bookingToCancel = activeBookings.FirstOrDefault(b => b.Id == bookingId);
        if (bookingToCancel == null)
            return;

        bookingToCancel.Cancel();
        Console.WriteLine("Booking cancelled successfully.");
        Console.ReadKey();
    }

    // ---------------- HELPER ----------------

    private static bool TryReadDateTimeOffset(out DateTimeOffset result)
    {
        result = default;

        Console.Write("Year: ");
        if (!int.TryParse(Console.ReadLine(), out var year)) return false;

        Console.Write("Month (1-12): ");
        if (!int.TryParse(Console.ReadLine(), out var month)) return false;

        Console.Write("Day: ");
        if (!int.TryParse(Console.ReadLine(), out var day)) return false;

        Console.Write("Hour (0-23): ");
        if (!int.TryParse(Console.ReadLine(), out var hour)) return false;

        Console.Write("Minute (0-59): ");
        if (!int.TryParse(Console.ReadLine(), out var minute)) return false;

        try
        {
            var local = new DateTime(year, month, day, hour, minute, 0);
            result = new DateTimeOffset(
                local,
                TimeZoneInfo.Local.GetUtcOffset(local)
            );
            return true;
        }
        catch
        {
            return false;
        }
    }
}
