using System;
using System.Collections.Generic;
using System.Linq;

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
            duration
        );

        booking.Confirm();
        _bookings.Add(booking);

        return booking;
    }

    public IEnumerable<Booking> GetActiveBookings()
    {
        return _bookings.Where(b => b.Status == BookingStatus.Confirmed);
    }
}
