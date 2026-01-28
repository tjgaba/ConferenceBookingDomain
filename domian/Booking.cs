using System;

public class Booking
{
    public int Id { get; }
    public ConferenceRoom Room { get; }
    public string RequestedBy { get; }
    public DateTime StartTime { get; }
    public DateTime EndTime { get; }
    public BookingStatus Status { get; private set; }

    public Booking(
        int id,
        ConferenceRoom room,
        string requestedBy,
        DateTime startTime,
        DateTime endTime)
    {
        // FAIL-FAST DOMAIN VALIDATION
        Room = room ?? throw new ArgumentNullException(nameof(room));

        RequestedBy = string.IsNullOrWhiteSpace(requestedBy)
            ? throw new ArgumentException("RequestedBy cannot be empty")
            : requestedBy;

        if (endTime <= startTime)
            throw new ArgumentException("End time must be after start time");

        Id = id;
        StartTime = startTime;
        EndTime = endTime;

        // INITIAL VALID STATE
        Status = BookingStatus.Pending;
    }

    public void Confirm()
    {
        // VALID STATE TRANSITION
        if (Status != BookingStatus.Pending)
            throw new InvalidOperationException(
                "Only pending bookings can be confirmed."
            );

        Status = BookingStatus.Confirmed;
    }

    public void Cancel()
    {
        // VALID STATE TRANSITION
        if (Status == BookingStatus.Cancelled)
            throw new InvalidOperationException(
                "Booking is already cancelled."
            );

        Status = BookingStatus.Cancelled;
    }
}
