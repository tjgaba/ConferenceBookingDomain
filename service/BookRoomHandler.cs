using System;
using System.Collections.Generic;
using System.Linq;

public class BookRoomHandler
{
    private int _bookingIdCounter;

    public BookRoomHandler(int bookingIdCounter)
    {
        _bookingIdCounter = bookingIdCounter;
    }

    public void BookRoom(BookingService bookingService, List<ConferenceRoom> rooms)
    {
        Console.Clear();

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

    // Non-interactive API-friendly method
    public Booking BookRoomNonInteractive(BookingService bookingService, int? bookingId, int roomId, string requestedBy, DateTimeOffset startTime, TimeSpan duration)
    {
        if (bookingService == null) throw new ArgumentNullException(nameof(bookingService));
        if (string.IsNullOrWhiteSpace(requestedBy)) throw new ArgumentException("requestedBy is required", nameof(requestedBy));
        var idToUse = bookingId ?? _bookingIdCounter++;
        return bookingService.CreateBooking(idToUse, roomId, requestedBy, startTime, duration);
    }

    private bool TryReadDateTimeOffset(out DateTimeOffset result)
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