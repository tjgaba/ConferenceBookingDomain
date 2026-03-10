using Microsoft.EntityFrameworkCore;
using ConferenceBooking.API.Data;
using ConferenceBooking.API.DTO;

namespace ConferenceBooking.API.Services;

public class SessionManagementService
{
    private readonly ApplicationDbContext _context;

    public SessionManagementService(ApplicationDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Validates session creation request
    /// </summary>
    public async Task<(bool isValid, string? errorMessage)> ValidateSessionCreationAsync(CreateSessionDTO dto)
    {
        if (dto.EndTime <= dto.StartTime)
        {
            return (false, "End time must be after start time");
        }

        if (dto.RoomId.HasValue)
        {
            var roomExists = await _context.ConferenceRooms.AnyAsync(r => r.Id == dto.RoomId.Value);
            if (!roomExists)
            {
                return (false, $"Room with ID {dto.RoomId.Value} not found");
            }
        }

        return (true, null);
    }

    /// <summary>
    /// Validates session update request
    /// </summary>
    public async Task<(bool isValid, string? errorMessage)> ValidateSessionUpdateAsync(int sessionId, UpdateSessionDTO dto)
    {
        if (sessionId != dto.Id)
        {
            return (false, "Session ID mismatch");
        }

        if (dto.EndTime <= dto.StartTime)
        {
            return (false, "End time must be after start time");
        }

        var session = await _context.ConferenceSessions.FindAsync(sessionId);
        if (session == null)
        {
            return (false, $"Session with ID {sessionId} not found");
        }

        if (dto.RoomId.HasValue)
        {
            var roomExists = await _context.ConferenceRooms.AnyAsync(r => r.Id == dto.RoomId.Value);
            if (!roomExists)
            {
                return (false, $"Room with ID {dto.RoomId.Value} not found");
            }
        }

        return (true, null);
    }

    /// <summary>
    /// Validates room assignment
    /// </summary>
    public async Task<(bool isValid, string? errorMessage)> ValidateRoomAssignmentAsync(int? roomId)
    {
        if (!roomId.HasValue)
        {
            return (true, null);
        }

        var roomExists = await _context.ConferenceRooms.AnyAsync(r => r.Id == roomId.Value);
        if (!roomExists)
        {
            return (false, $"Room with ID {roomId.Value} not found");
        }

        return (true, null);
    }

    /// <summary>
    /// Validates session deletion request
    /// </summary>
    public async Task<(bool isValid, string? errorMessage)> ValidateSessionDeletionAsync(int sessionId)
    {
        var session = await _context.ConferenceSessions.FindAsync(sessionId);
        if (session == null)
        {
            return (false, $"Session with ID {sessionId} not found");
        }

        return (true, null);
    }

    /// <summary>
    /// Validates that a room exists
    /// </summary>
    public async Task<(bool isValid, string? errorMessage)> ValidateRoomExistsAsync(int roomId)
    {
        var roomExists = await _context.ConferenceRooms.AnyAsync(r => r.Id == roomId);
        if (!roomExists)
        {
            return (false, $"Room with ID {roomId} not found");
        }

        return (true, null);
    }
}
