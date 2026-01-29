using System;

public class Booking
{
    public int Id { get; }
    public ConferenceRoom Room { get; }
    public string RequestedBy { get; }
    public DateTimeOffset StartTime { get; }
    public DateTimeOffset EndTime { get; }
    public BookingStatus Status { get; private set; }

    public Booking(
        int id,
        ConferenceRoom room,
        string requestedBy,
        DateTimeOffset startTime,
        TimeSpan duration)
    {
        Room = room ?? throw new ArgumentNullException(nameof(room));
        if (string.IsNullOrWhiteSpace(requestedBy))
            throw new ArgumentException("RequestedBy cannot be empty.");
        if (duration <= TimeSpan.Zero)
            throw new ArgumentException("Duration must be greater than zero.");

        Id = id;
        RequestedBy = requestedBy;
        StartTime = startTime;
        EndTime = startTime.Add(duration);
        Status = BookingStatus.Pending;
    }

    public void Confirm()
    {
        if (Status != BookingStatus.Pending)
            throw new InvalidOperationException();
        Status = BookingStatus.Confirmed;
    }

    public void Cancel()
    {
        if (Status == BookingStatus.Cancelled)
            throw new InvalidOperationException();
        Status = BookingStatus.Cancelled;
    }
}
