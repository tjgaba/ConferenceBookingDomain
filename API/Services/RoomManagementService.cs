using Microsoft.EntityFrameworkCore;
using ConferenceBooking.API.Data;
using ConferenceBooking.API.DTO;
using ConferenceBooking.API.Entities;

namespace ConferenceBooking.API.Services;

public class RoomManagementService
{
    private readonly ApplicationDbContext _dbContext;

    public RoomManagementService(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    /// <summary>
    /// Validates room status change
    /// </summary>
    public async Task<(bool isValid, string? errorMessage, ConferenceRoom? room)> ValidateRoomStatusChangeAsync(int roomId, bool newStatus)
    {
        var room = await _dbContext.ConferenceRooms.FindAsync(roomId);
        if (room == null)
        {
            return (false, $"Room with ID {roomId} not found.", null);
        }

        // Check for future bookings when deactivating
        if (!newStatus && room.IsActive)
        {
            var hasFutureBookings = await _dbContext.Bookings
                .AnyAsync(b => b.RoomId == roomId && 
                              b.Status == BookingStatus.Confirmed && 
                              b.EndTime > DateTimeOffset.Now);

            if (hasFutureBookings)
            {
                return (false, "Cannot deactivate room with future confirmed bookings. Please cancel bookings first.", null);
            }
        }

        return (true, null, room);
    }

    /// <summary>
    /// Validates room update request
    /// </summary>
    public async Task<(bool isValid, string? errorMessage, ConferenceRoom? room)> ValidateRoomUpdateAsync(int roomId)
    {
        var room = await _dbContext.ConferenceRooms.FindAsync(roomId);
        if (room == null)
        {
            return (false, $"Room with ID {roomId} not found.", null);
        }

        return (true, null, room);
    }

    /// <summary>
    /// Validates room creation request
    /// </summary>
    public (bool isValid, string? errorMessage) ValidateRoomCreation(string name, int capacity)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            return (false, "Room name is required.");
        }

        if (capacity <= 0)
        {
            return (false, "Room capacity must be greater than 0.");
        }

        return (true, null);
    }

    /// <summary>
    /// Validates room deletion
    /// </summary>
    public async Task<(bool isValid, string? errorMessage, ConferenceRoom? room)> ValidateRoomDeletionAsync(int roomId)
    {
        var room = await _dbContext.ConferenceRooms.FindAsync(roomId);
        if (room == null)
        {
            return (false, $"Room with ID {roomId} not found.", null);
        }

        var hasActiveBookings = await _dbContext.Bookings
            .AnyAsync(b => b.RoomId == roomId && 
                          b.Status == BookingStatus.Confirmed &&
                          b.EndTime > DateTimeOffset.Now);

        if (hasActiveBookings)
        {
            return (false, "Cannot delete room with active bookings. Please deactivate instead.", null);
        }

        return (true, null, room);
    }

    /// <summary>
    /// Applies status change to room
    /// </summary>
    public void ApplyStatusChange(ConferenceRoom room, bool isActive)
    {
        room.IsActive = isActive;
        room.DeletedAt = isActive ? null : DateTimeOffset.UtcNow;
    }

    /// <summary>
    /// Applies updates to room from request
    /// </summary>
    public async Task<(bool isValid, string? errorMessage)> ApplyRoomUpdates(ConferenceRoom room, UpdateRoomDTO request)
    {
        if (!string.IsNullOrWhiteSpace(request.Name))
            room.Name = request.Name;

        if (request.Capacity.HasValue && request.Capacity.Value > 0)
            room.Capacity = request.Capacity.Value;

        if (request.Number.HasValue)
            room.Number = request.Number.Value;

        if (request.Location.HasValue)
            room.Location = request.Location.Value;

        if (request.IsActive.HasValue)
        {
            // Check for future bookings when deactivating
            if (!request.IsActive.Value && room.IsActive)
            {
                var hasFutureBookings = await _dbContext.Bookings
                    .AnyAsync(b => b.RoomId == room.Id && 
                                  b.Status == BookingStatus.Confirmed && 
                                  b.EndTime > DateTimeOffset.Now);

                if (hasFutureBookings)
                {
                    return (false, "Cannot deactivate room with future confirmed bookings. Please cancel bookings first.");
                }

                room.DeletedAt = DateTimeOffset.UtcNow;
            }
            else if (request.IsActive.Value && !room.IsActive)
            {
                room.DeletedAt = null;
            }

            room.IsActive = request.IsActive.Value;
        }

        return (true, null);
    }
}
