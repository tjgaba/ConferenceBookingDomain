using System;
using System.Collections.Generic;
using System.Linq;

public class BookingService
{
    // ORDERED COLLECTION:
    // Stores all bookings created in the system
    private readonly List<Booking> _bookings;

    // DICTIONARY FOR FAST LOOKUP:
    // Key = Room Id, Value = ConferenceRoom
    private readonly Dictionary<int, ConferenceRoom> _roomsById;

    public BookingService(
        List<ConferenceRoom> rooms,
        List<Booking> bookings)
    {
        // Convert rooms list to dictionary for fast lookup
        _roomsById = rooms.ToDictionary(r => r.Id);
        _bookings = bookings;
    }

    // BUSINESS LOGIC:
    // Returns rooms that are available at a specific time
    public IEnumerable<ConferenceRoom> GetAvailableRooms(DateTime atTime)
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

    // BUSINESS RULE:
    // Determines whether a room can be booked for a time slot
    public bool CanBookRoom(
        int roomId,
        DateTime startTime,
        DateTime endTime)
    {
        return !_bookings.Any(b =>
            b.Room.Id == roomId &&
            b.Status == BookingStatus.Confirmed &&
            startTime < b.EndTime &&
            b.StartTime < endTime
        );
    }

    // CORE USE CASE:
    // Creates and confirms a booking if business rules allow it
    public Booking CreateBooking(
        int bookingId,
        int roomId,
        string requestedBy,
        DateTime startTime,
        DateTime endTime)
    {
        // FAIL-FAST: room must exist
        if (!_roomsById.TryGetValue(roomId, out var room))
            throw new InvalidOperationException("Conference room does not exist.");

        // FAIL-FAST: room must be available
        if (!CanBookRoom(roomId, startTime, endTime))
            throw new InvalidOperationException(
                "Room is already booked for the selected time slot."
            );

        var booking = new Booking(
            bookingId,
            room,
            requestedBy,
            startTime,
            endTime
        );

        booking.Confirm();
        _bookings.Add(booking);

        return booking;
    }

    // BUSINESS QUERY:
    // Returns only active (confirmed) bookings
    public IEnumerable<Booking> GetActiveBookings()
    {
        return _bookings.Where(b => b.Status == BookingStatus.Confirmed);
    }
}
