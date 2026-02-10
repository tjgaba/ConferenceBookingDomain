using ConferenceBooking.API.DTO;
using ConferenceBooking.API.Data;
using ConferenceBooking.API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

/// <summary>
/// Controller for checking room availability.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize] // Protect all endpoints in this controller
public class CheckAvailableRoomsController : ControllerBase
{
    private readonly ApplicationDbContext _dbContext;

    public CheckAvailableRoomsController(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    /// <summary>
    /// Get availability of a specific room by room ID
    /// </summary>
    [HttpGet("ByRoomNumber")]
    public async Task<IActionResult> GetAvailabilityByRoomNumber([FromQuery] int roomId)
    {
        var room = await _dbContext.ConferenceRooms.FindAsync(roomId);
        if (room == null)
        {
            return NotFound(new { Message = $"Room with ID {roomId} not found." });
        }

        if (!room.IsActive)
        {
            return BadRequest(new { Message = "This room is not currently active." });
        }

        var isAvailable = !await _dbContext.Bookings.AnyAsync(b =>
            b.RoomId == roomId &&
            b.Status == BookingStatus.Confirmed &&
            b.StartTime <= DateTimeOffset.Now &&
            DateTimeOffset.Now < b.EndTime);

        var availability = new CheckAvailableRoomsDTO
        {
            RoomId = room.Id,
            RoomName = room.Name,
            Capacity = room.Capacity,
            IsAvailable = isAvailable
        };

        return Ok(availability);
    }

    /// <summary>
    /// Get all available rooms at a specific time
    /// </summary>
    [HttpGet("ByTime")]
    public async Task<IActionResult> GetAvailableRoomsByTime([FromQuery] DateTimeOffset? atTime)
    {
        var requestedTime = atTime ?? DateTimeOffset.Now;

        var availableRooms = await _dbContext.ConferenceRooms
            .Where(room => room.IsActive && !_dbContext.Bookings.Any(b =>
                b.RoomId == room.Id &&
                b.Status == BookingStatus.Confirmed &&
                b.StartTime <= requestedTime &&
                requestedTime < b.EndTime))
            .Select(room => new CheckAvailableRoomsDTO
            {
                RoomId = room.Id,
                RoomName = room.Name,
                Capacity = room.Capacity,
                IsAvailable = true
            })
            .ToListAsync();

        return Ok(availableRooms);
    }
}
