using System;
using System.Collections.Generic;
using System.Linq;
using System.IO;
using System.Text.Json;
using System.Threading.Tasks;

public class BookingService
{
    private readonly List<Booking> _bookings;
    private readonly Dictionary<int, ConferenceRoom> _roomsById;

    public BookingService(
        List<ConferenceRoom> rooms,
        List<Booking> bookings)
    {
        _roomsById = rooms.ToDictionary(r => r.Id);
        _bookings = bookings;
    }

    public IEnumerable<ConferenceRoom> GetAvailableRooms(DateTimeOffset atTime)
    {
        return _roomsById.Values.Where(room =>
            !_bookings.Any(b =>
                b.Room.Id == room.Id &&
                b.Status == BookingStatus.Confirmed &&
                b.StartTime <= atTime &&
                atTime < b.EndTime
            )
        );
    }

    public Booking? GetActiveBookingForRoom(
        int roomId,
        DateTimeOffset atTime)
    {
        // Ensure the method retrieves bookings that are confirmed and overlap with the given time
        return _bookings.FirstOrDefault(b =>
            b.Room.Id == roomId &&
            b.Status == BookingStatus.Confirmed &&
            b.StartTime <= atTime &&
            atTime < b.EndTime
        );
    }

    // ✅ FIXED HERE: >= instead of >
    public Booking? GetNextBookingForRoom(
        int roomId,
        DateTimeOffset fromTime)
    {
        return _bookings
            .Where(b =>
                b.Room.Id == roomId &&
                b.Status == BookingStatus.Confirmed &&
                b.StartTime >= fromTime
            )
            .OrderBy(b => b.StartTime)
            .FirstOrDefault();
    }

    public Booking CreateBooking(
        int bookingId,
        int roomId,
        string requestedBy,
        DateTimeOffset startTime,
        TimeSpan duration)
    {
        if (!_roomsById.TryGetValue(roomId, out var room))
            throw new InvalidBookingException("Conference room does not exist.");

        var endTime = startTime.Add(duration);

        var hasOverlap = _bookings.Any(b =>
            b.Room.Id == roomId &&
            b.Status == BookingStatus.Confirmed &&
            startTime < b.EndTime &&
            b.StartTime < endTime
        );

        if (hasOverlap)
            throw new InvalidBookingException(
                "Room is already booked for the selected time slot."
            );

        var booking = new Booking(
            bookingId,
            room,
            requestedBy,
            startTime,
            endTime,
            BookingStatus.Pending
        );

        booking.Confirm();
        _bookings.Add(booking);

        return booking;
    }

    public IEnumerable<Booking> GetActiveBookings()
    {
        return _bookings.Where(b => b.Status == BookingStatus.Confirmed);
    }

    public async Task SaveBookingsAsync(string filePath)
    {
        try
        {
            var json = JsonSerializer.Serialize(_bookings);
            await File.WriteAllTextAsync(filePath, json);
        }
        catch (IOException ex)
        {
            Console.WriteLine($"Error saving bookings: {ex.Message}");
        }
    }

    public async Task LoadBookingsAsync(string filePath)
    {
        try
        {
            if (File.Exists(filePath))
            {
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                };

                var json = await File.ReadAllTextAsync(filePath);
                var bookings = JsonSerializer.Deserialize<List<Booking>>(json, options);
                if (bookings != null)
                {
                    _bookings.Clear();
                    _bookings.AddRange(bookings);
                }
            }
        }
        catch (JsonException ex)
        {
            Console.WriteLine($"Error: Invalid JSON in {filePath}. {ex.Message}");
        }
        catch (IOException ex)
        {
            Console.WriteLine($"Error loading bookings: {ex.Message}");
        }
    }

    public async Task DeleteBookingAsync(int bookingId, string filePath)
    {
        try
        {
            if (File.Exists(filePath))
            {
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                };

                var json = await File.ReadAllTextAsync(filePath);
                var bookings = JsonSerializer.Deserialize<List<Booking>>(json, options) ?? new List<Booking>();

                var bookingToDelete = bookings.FirstOrDefault(b => b.Id == bookingId);
                if (bookingToDelete != null)
                {
                    bookings.Remove(bookingToDelete);

                    var updatedJson = JsonSerializer.Serialize(bookings, options);
                    await File.WriteAllTextAsync(filePath, updatedJson);

                    Console.WriteLine($"Booking with ID {bookingId} deleted successfully.");
                }
                else
                {
                    Console.WriteLine($"Booking with ID {bookingId} not found.");
                }
            }
            else
            {
                Console.WriteLine("Error: Bookings file not found.");
            }
        }
        catch (JsonException ex)
        {
            Console.WriteLine($"Error: Invalid JSON in {filePath}. {ex.Message}");
        }
        catch (IOException ex)
        {
            Console.WriteLine($"Error deleting booking: {ex.Message}");
        }
    }
}
