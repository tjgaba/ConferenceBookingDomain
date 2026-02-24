using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ConferenceBooking.API.Auth;
using ConferenceBooking.API.Data;
using ConferenceBooking.API.DTO;
using ConferenceBooking.API.Entities;
using ConferenceBooking.API.Models;

namespace ConferenceBooking.API.Services;

public class BookingManagementService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ApplicationDbContext _dbContext;

    public BookingManagementService(UserManager<ApplicationUser> userManager, ApplicationDbContext dbContext)
    {
        _userManager = userManager;
        _dbContext = dbContext;
    }

    /// <summary>
    /// Validates and retrieves the current authenticated user
    /// </summary>
    public async Task<(bool isValid, string? errorMessage, ApplicationUser? user)> ValidateCurrentUserAsync(string? username)
    {
        if (username == null)
            return (false, "User not authenticated", null);

        var user = await _userManager.FindByNameAsync(username);
        if (user == null)
            return (false, "User not found", null);

        if (!user.IsActive)
            return (false, "User account is inactive", null);

        return (true, null, user);
    }

    /// <summary>
    /// Validates location input
    /// </summary>
    public (bool isValid, string? errorMessage, RoomLocation? location) ValidateLocation(string locationInput)
    {
        if (!Enum.TryParse<RoomLocation>(locationInput, true, out var location))
        {
            var validLocations = string.Join(", ", Enum.GetNames(typeof(RoomLocation)));
            return (false, $"Invalid location. Valid values are: {validLocations}", null);
        }

        return (true, null, location);
    }

    /// <summary>
    /// Validates booking confirmation request
    /// </summary>
    public async Task<(bool isValid, string? errorMessage, Booking? booking)> ValidateBookingConfirmationAsync(int bookingId)
    {
        var booking = await _dbContext.Bookings
            .Include(b => b.Room)
            .Include(b => b.User)
            .FirstOrDefaultAsync(b => b.Id == bookingId);

        if (booking == null)
            return (false, "Booking not found", null);

        if (booking.Status == BookingStatus.Confirmed)
            return (false, "Booking is already confirmed", null);

        if (booking.Status == BookingStatus.Cancelled)
            return (false, "Cannot confirm a cancelled booking", null);

        // Check for conflicts with confirmed bookings
        var confirmedBookings = await _dbContext.Bookings
            .Where(b => b.RoomId == booking.RoomId && b.Status == BookingStatus.Confirmed)
            .ToListAsync();

        var hasConflict = confirmedBookings
            .Any(b => b.EndTime > booking.StartTime && b.StartTime < booking.EndTime);

        if (hasConflict)
            return (false, "Cannot confirm: Room is not available during the requested time", null);

        return (true, null, booking);
    }

    /// <summary>
    /// Validates booking cancellation request
    /// </summary>
    public async Task<(bool isValid, string? errorMessage, Booking? booking)> ValidateBookingCancellationAsync(int bookingId)
    {
        var booking = await _dbContext.Bookings
            .Include(b => b.Room)
            .Include(b => b.User)
            .FirstOrDefaultAsync(b => b.Id == bookingId);

        if (booking == null)
            return (false, "Booking not found", null);

        if (booking.Status == BookingStatus.Cancelled)
            return (false, "Booking is already cancelled", null);

        return (true, null, booking);
    }

    /// <summary>
    /// Validates booking ID match
    /// </summary>
    public (bool isValid, string? errorMessage) ValidateIdMatch(int urlId, int dtoId)
    {
        if (urlId != dtoId)
            return (false, "Booking ID in URL does not match the request body");

        return (true, null);
    }

    /// <summary>
    /// Validates and parses booking status
    /// </summary>
    public (bool isValid, string? errorMessage, BookingStatus? status) ValidateBookingStatus(string statusInput)
    {
        if (string.IsNullOrWhiteSpace(statusInput))
            return (true, null, null);

        if (!Enum.TryParse<BookingStatus>(statusInput, true, out var status))
        {
            var validStatuses = string.Join(", ", Enum.GetNames(typeof(BookingStatus)));
            return (false, $"Invalid status. Valid values are: {validStatuses}", null);
        }

        return (true, null, status);
    }

    /// <summary>
    /// Maps booking entity to detail DTO
    /// </summary>
    public BookingDetailDTO MapToDetailDto(Booking booking)
    {
        return new BookingDetailDTO
        {
            BookingId = booking.Id,
            RoomId = booking.RoomId,
            RoomName = booking.Room?.Name ?? "Unknown",
            RoomNumber = booking.Room?.Number ?? 0,
            Location = booking.Location.ToString(),
            IsRoomActive = booking.Room?.IsActive ?? false,
            RequestedBy = booking.User?.UserName ?? "Unknown User",
            StartTime = booking.StartTime,
            EndTime = booking.EndTime,
            Status = booking.Status.ToString(),
            Capacity = booking.Capacity,
            CreatedAt = booking.CreatedAt,
            CancelledAt = booking.CancelledAt
        };
    }

    /// <summary>
    /// Applies updates from DTO to booking entity
    /// </summary>
    public void ApplyBookingUpdates(Booking booking, UpdateBookingDTO dto, ConferenceRoom validatedRoom)
    {
        if (dto.RoomId.HasValue && dto.RoomId.Value != booking.RoomId)
        {
            booking.RoomId = dto.RoomId.Value;
            booking.Room = validatedRoom;
        }

        if (dto.StartTime.HasValue)
            // Convert to UTC - PostgreSQL timestamp with time zone requires UTC (offset=0)
            booking.StartTime = dto.StartTime.Value.ToUniversalTime();

        if (dto.EndTime.HasValue)
            booking.EndTime = dto.EndTime.Value.ToUniversalTime();
    }

    /// <summary>
    /// Applies status change to booking
    /// </summary>
    public void ApplyStatusChange(Booking booking, BookingStatus newStatus)
    {
        booking.Status = newStatus;

        if (newStatus == BookingStatus.Cancelled && !booking.CancelledAt.HasValue)
            booking.CancelledAt = DateTimeOffset.UtcNow;
    }
}
