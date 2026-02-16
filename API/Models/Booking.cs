using System;
using System.Text.Json.Serialization;
using ConferenceBooking.API.Entities;
using ConferenceBooking.API.Auth;
namespace ConferenceBooking.API.Models;


public class Booking
{
    public int Id { get; set; }
    public int RoomId { get; set; } // Foreign key
    public ConferenceRoom Room { get; set; } // Navigation property
    
    public string UserId { get; set; } = string.Empty; // Foreign key to ApplicationUser
    public ApplicationUser? User { get; set; } // Navigation property
    
    [Obsolete("Use UserId and User navigation property instead")]
    public string RequestedBy { get; set; } // Kept for backward compatibility, populate from User.FullName
    
    public DateTimeOffset StartTime { get; set; }
    public DateTimeOffset EndTime { get; set; }
    public BookingStatus Status { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset? CancelledAt { get; set; }
    public RoomLocation Location { get; set; }
    public int Capacity { get; set; }

    [JsonConstructor]
    public Booking(
        int id,
        ConferenceRoom room,
        string requestedBy,
        DateTimeOffset startTime,
        DateTimeOffset endTime,
        BookingStatus status,
        RoomLocation location,
        int capacity)
    {
        Id = id;
        RoomId = room.Id;
        Room = room;
        RequestedBy = requestedBy;
        StartTime = startTime;
        EndTime = endTime;
        Status = status;
        Location = location;
        Capacity = capacity;
        CreatedAt = DateTimeOffset.UtcNow;
    }

    public Booking()
    {
        // Parameterless constructor for EF Core
        // Navigation properties should be null by default - EF Core will populate them
        Room = null!; // Will be populated by EF Core from RoomId foreign key
        RequestedBy = string.Empty; // Default initialization
        CreatedAt = DateTimeOffset.UtcNow;
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
        CancelledAt = DateTimeOffset.UtcNow;
    }
}