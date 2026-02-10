using System;
using System.Text.Json.Serialization;
using ConferenceBooking.API.Entities;
namespace ConferenceBooking.API.Models;


public class Booking
{
    public int Id { get; set; }
    public int RoomId { get; set; } // Foreign key
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
        RoomId = room.Id;
        Room = room;
        RequestedBy = requestedBy;
        StartTime = startTime;
        EndTime = endTime;
        Status = status;
    }

    public Booking()
    {
        // Parameterless constructor for EF Core
        Room = new ConferenceRoom(); // Default initialization
        RequestedBy = string.Empty; // Default initialization
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
            throw new InvalidOperationException("Booking is already cancelled.");

        Status = BookingStatus.Cancelled;
    }
}