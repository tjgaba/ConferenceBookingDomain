using System;
using System.Text.Json.Serialization;

public class Booking
{
    public int Id { get; set; }
    public ConferenceRoom Room { get; set; }
    public string RequestedBy { get; set; }
    public DateTimeOffset StartTime { get; set; }
    public DateTimeOffset EndTime { get; set; }
    public BookingStatus Status { get; set; }

    [JsonConstructor]
    public Booking(
        int id,
        ConferenceRoom room,
        string requestedBy,
        DateTimeOffset startTime,
        DateTimeOffset endTime,
        BookingStatus status)
    {
        Id = id;
        Room = room;
        RequestedBy = requestedBy;
        StartTime = startTime;
        EndTime = endTime;
        Status = status;
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
