using System;
using System.Collections.Generic;
using System.Linq;
using System.IO;
using System.Text.Json;
using System.Threading.Tasks;
using ConferenceBooking.Persistence;

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

    public Booking CreateBooking(
        int bookingId,
        int roomId,
        string requestedBy,
        DateTimeOffset startTime,
        TimeSpan duration)
    {
        if (!_roomsById.ContainsKey(roomId))
            throw new ArgumentException("Room does not exist.");

        var room = _roomsById[roomId];
        var endTime = startTime + duration;

        if (_bookings.Any(b =>
            b.Room.Id == roomId &&
            b.Status == BookingStatus.Confirmed &&
            b.StartTime < endTime &&
            startTime < b.EndTime))
        {
            throw new InvalidOperationException("Room is not available during the requested time.");
        }

        var booking = new Booking(
            bookingId,
            room,
            requestedBy,
            startTime,
            endTime,
            BookingStatus.Confirmed
        );

        _bookings.Add(booking);
        return booking;
    }

    public async Task LoadBookingsAsync(string filePath)
    {
        if (!File.Exists(filePath)) return;

        var json = await File.ReadAllTextAsync(filePath);
        var bookings = JsonSerializer.Deserialize<List<BookingRecord>>(json);

        foreach (var record in bookings ?? Enumerable.Empty<BookingRecord>())
        {
            if (_roomsById.TryGetValue(record.RoomId, out var room))
            {
                _bookings.Add(new Booking(
                    record.Id,
                    room,
                    record.RequestedBy,
                    record.StartTime,
                    record.EndTime,
                    record.Status
                ));
            }
        }
    }

    public async Task SaveBookingsAsync(string filePath)
    {
        var records = _bookings.Select(b => new BookingRecord
        {
            Id = b.Id,
            RoomId = b.Room.Id,
            RequestedBy = b.RequestedBy,
            StartTime = b.StartTime,
            EndTime = b.EndTime,
            Status = b.Status
        });

        var json = JsonSerializer.Serialize(records);
        await File.WriteAllTextAsync(filePath, json);
    }
}