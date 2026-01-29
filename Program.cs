using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

class Program
{
    private static int _bookingIdCounter = 1;

    static async Task Main(string[] args)
    {
        var rooms = ConferenceRoomRepository.GetRooms();
        var roomsById = rooms.ToDictionary(r => r.Id);

        List<Booking> bookings;

        // ----------- ASYNC LOAD WITH FAILURE HANDLING -----------
        try
        {
            bookings = await BookingFileStore.LoadAsync(roomsById);
            Console.WriteLine("Bookings loaded successfully.");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Load failed: {ex.Message}");
            bookings = new List<Booking>();
        }

        // Ensure booking IDs continue correctly
        if (bookings.Any())
            _bookingIdCounter = bookings.Max(b => b.Id) + 1;

        var bookingService = new BookingService(rooms, bookings);

        // ---------------- INTERACTIVE MENU LOOP ----------------
        while (true)
        {
            Console.WriteLine();
            Console.WriteLine("=== Conference Room Booking System ===");
            Console.WriteLine("1. Book a room");
            Console.WriteLine("2. View room availability");
            Console.WriteLine("3. Cancel a booking");
            Console.WriteLine("0. Exit");
            Console.Write("Select an option: ");

            var choice = Console.ReadLine();

            try
            {
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
                        await SaveAndExit(bookings);
                        return;

                    default:
                        Console.WriteLine("Invalid option.");
                        break;
                }
            }
            catch (InvalidBookingException ex)
            {
                // Business rule failure (expected)
                Console.WriteLine($"Booking error: {ex.Message}");
            }
            catch (Exception ex)
            {
                // Unexpected failure
                Console.WriteLine($"Unexpected error: {ex.Message}");
            }
        }
    }

    // ---------------- BOOK ROOM ----------------

    private static void BookRoom(
        BookingService bookingService,
        List<ConferenceRoom> rooms)
    {
        Console.Write("Enter your name: ");
        var requestedBy = Console.ReadLine();

        Console.WriteLine("\nAvailable Rooms:");
        foreach (var room in rooms)
            Console.WriteLine($"{room.Id}. {room.Name} (Capacity: {room.Capacity})");

        Console.Write("Select Room ID: ");
        if (!int.TryParse(Console.ReadLine(), out var roomId))
            throw new InvalidBookingException("Invalid room ID.");

        Console.WriteLine("Enter meeting start date & time:");
        if (!TryReadDateTimeOffset(out var startTime))
            throw new InvalidBookingException("Invalid date/time.");

        Console.Write("Enter duration (minutes): ");
        if (!int.TryParse(Console.ReadLine(), out var minutes) || minutes <= 0)
            throw new InvalidBookingException("Invalid duration.");

        bookingService.CreateBooking(
            _bookingIdCounter++,
            roomId,
            requestedBy,
            startTime,
            TimeSpan.FromMinutes(minutes));

        Console.WriteLine("Booking created successfully.");
    }

    // ---------------- VIEW AVAILABILITY ----------------

    private static void ViewAvailability(
        BookingService bookingService,
        List<ConferenceRoom> rooms)
    {
        var now = DateTimeOffset.Now;

        Console.WriteLine();
        Console.WriteLine($"Availability (Now: {now})");
        Console.WriteLine("-------------------------------------------");

        foreach (var room in rooms)
        {
            var booking = bookingService.GetActiveBookingForRoom(room.Id, now);
            var status = booking == null ? "Available" : "Unavailable";
            Console.WriteLine($"{room.Name} | {status}");
        }
    }

    // ---------------- CANCEL BOOKING ----------------

    private static void CancelBooking(BookingService bookingService)
    {
        var activeBookings = bookingService.GetActiveBookings().ToList();

        if (!activeBookings.Any())
        {
            Console.WriteLine("No active bookings to cancel.");
            return;
        }

        Console.WriteLine("\nActive Bookings:");
        foreach (var booking in activeBookings)
        {
            Console.WriteLine(
                $"ID: {booking.Id} | Room: {booking.Room.Name} | " +
                $"{booking.StartTime} - {booking.EndTime}"
            );
        }

        Console.Write("Enter Booking ID to cancel: ");
        if (!int.TryParse(Console.ReadLine(), out var bookingId))
            throw new InvalidBookingException("Invalid booking ID.");

        var bookingToCancel =
            activeBookings.FirstOrDefault(b => b.Id == bookingId);

        if (bookingToCancel == null)
            throw new InvalidBookingException("Booking not found.");

        bookingToCancel.Cancel();
        Console.WriteLine("Booking cancelled.");
    }

    // ---------------- SAVE & EXIT ----------------

    private static async Task SaveAndExit(List<Booking> bookings)
    {
        try
        {
            await BookingFileStore.SaveAsync(bookings);
            Console.WriteLine("Bookings saved successfully.");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Save failed: {ex.Message}");
        }

        Console.WriteLine("Goodbye!");
    }

    // ---------------- HELPER ----------------

    private static bool TryReadDateTimeOffset(out DateTimeOffset result)
    {
        result = default;

        Console.Write("Year: ");
        if (!int.TryParse(Console.ReadLine(), out var year)) return false;

        Console.Write("Month: ");
        if (!int.TryParse(Console.ReadLine(), out var month)) return false;

        Console.Write("Day: ");
        if (!int.TryParse(Console.ReadLine(), out var day)) return false;

        Console.Write("Hour: ");
        if (!int.TryParse(Console.ReadLine(), out var hour)) return false;

        Console.Write("Minute: ");
        if (!int.TryParse(Console.ReadLine(), out var minute)) return false;

        try
        {
            var local = new DateTime(year, month, day, hour, minute, 0);
            result = new DateTimeOffset(
                local,
                TimeZoneInfo.Local.GetUtcOffset(local));
            return true;
        }
        catch
        {
            return false;
        }
    }
}
