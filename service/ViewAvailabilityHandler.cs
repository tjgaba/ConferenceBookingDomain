using System;
using System.Collections.Generic;
using System.Linq;

public class ViewAvailabilityHandler
{
    public void ViewAvailability(BookingService bookingService, List<ConferenceRoom> rooms)
    {
        Console.Clear();

        if (!rooms.Any())
        {
            Console.WriteLine("Error: No rooms available.");
            Console.ReadKey();
            return;
        }

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

    private void ShowAvailabilityTable(BookingService bookingService, List<ConferenceRoom> rooms, DateTimeOffset atTime)
    {
        Console.WriteLine($"Room Availability at {atTime}");
        Console.WriteLine("------------------------------------------------------------------------------------");
        Console.WriteLine("Room    | Capacity | Status       | Booking / Availability");
        Console.WriteLine("------------------------------------------------------------------------------------");

        foreach (var room in rooms)
        {
            var activeBooking = bookingService.GetActiveBookingForRoom(room.Id, atTime);

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
                var nextBooking = bookingService.GetNextBookingForRoom(room.Id, atTime);

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

    // Non-interactive API-friendly method
    public IEnumerable<ConferenceRoom> GetAvailability(BookingService bookingService, DateTimeOffset atTime)
    {
        if (bookingService == null) throw new ArgumentNullException(nameof(bookingService));
        return bookingService.GetAvailableRooms(atTime);
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