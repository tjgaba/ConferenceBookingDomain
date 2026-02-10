using ConferenceBooking.API.Services;
using ConferenceBooking.API.DTO;
using ConferenceBooking.API.Auth;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

/// <summary>
/// Controller for managing room availability.
/// </summary>
[ApiController]
[Route("api/[controller]ByRoomNumber")]
[Authorize] // Protect all endpoints in this controller
public class AvailabilityController : ControllerBase
{
    private readonly BookingManager _bookingManager;

    public AvailabilityController(BookingManager bookingManager)
    {
        _bookingManager = bookingManager;
    }

    [HttpGet]
    public async Task<IActionResult> GetAvailability([FromQuery] int roomId)
    {
        var room = await _bookingManager.GetRoomByIdAsync(roomId);
        if (room == null)
        {
            return NotFound(new { Message = $"Room with ID {roomId} not found." });
        }

        var availability = new AvailabilityDTO
        {
            RoomId = room.Id,
            RoomName = room.Name,
            IsAvailable = await _bookingManager.IsRoomAvailableAsync(room.Id, DateTimeOffset.Now)
        };

        return Ok(availability);
    }
}