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

        // Check if there are any rooms available before proceeding
        if (!rooms.Any())
        {
            Console.WriteLine("Error: No rooms available.");
            Console.ReadKey();
            return;
        }

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

        // Check if there are any rooms available before showing availability
        if (!rooms.Any())
        {
            Console.WriteLine("Error: No rooms available.");
            Console.ReadKey();
            return;
        }

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
            // Check for active bookings for the room at the given time
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
                // Check for the next booking for the room
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

        // Get the list of active bookings
        var activeBookings = bookingService.GetActiveBookings().ToList();

        // Check if there are any active bookings to cancel
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

        while (true)
        {
            Console.Write("Year: ");
            var input = Console.ReadLine();
            if (string.IsNullOrWhiteSpace(input)) return false;
            if (int.TryParse(input, out var year) && year >= 1 && year <= 9999)
            {
                while (true)
                {
                    Console.Write("Month (1-12): ");
                    input = Console.ReadLine();
                    if (string.IsNullOrWhiteSpace(input)) return false;
                    if (int.TryParse(input, out var month) && month >= 1 && month <= 12)
                    {
                        while (true)
                        {
                            Console.Write("Day: ");
                            input = Console.ReadLine();
                            if (string.IsNullOrWhiteSpace(input)) return false;
                            if (int.TryParse(input, out var day) && day >= 1 && day <= DateTime.DaysInMonth(year, month))
                            {
                                while (true)
                                {
                                    Console.Write("Hour (0-23): ");
                                    input = Console.ReadLine();
                                    if (string.IsNullOrWhiteSpace(input)) return false;
                                    if (int.TryParse(input, out var hour) && hour >= 0 && hour <= 23)
                                    {
                                        while (true)
                                        {
                                            Console.Write("Minute (0-59): ");
                                            input = Console.ReadLine();
                                            if (string.IsNullOrWhiteSpace(input)) return false;
                                            if (int.TryParse(input, out var minute) && minute >= 0 && minute <= 59)
                                            {
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
                                                    Console.WriteLine("Error: Invalid date and time.");
                                                    return false;
                                                }
                                            }
                                            Console.WriteLine("Minute invalid, please enter a minute between 0-59 or press 'Enter' to exit.");
                                        }
                                    }
                                    Console.WriteLine("Hour invalid, please enter an hour between 0-23 or press 'Enter' to exit.");
                                }
                            }
                            Console.WriteLine("Day invalid, please enter a valid day for the given month and year or press 'Enter' to exit.");
                        }
                    }
                    Console.WriteLine("Month invalid, please enter a month between 1-12 or press 'Enter' to exit.");
                }
            }
            Console.WriteLine("Year invalid, please enter a year between 1-9999 or press 'Enter' to exit.");
        }
    }
}
