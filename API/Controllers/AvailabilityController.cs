using ConferenceBooking.API.Services;
using ConferenceBooking.API.DTO;
using ConferenceBooking.API.Auth;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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
    public IActionResult GetAvailability([FromQuery] int roomNumber)
    {
        var room = _bookingManager.GetRoomByNumber(roomNumber);
        if (room == null)
        {
            return NotFound(new { Message = $"Room with number {roomNumber} not found." });
        }

        var availability = new AvailabilityDTO
        {
            RoomId = room.Id,
            RoomName = room.Name,
            IsAvailable = _bookingManager.IsRoomAvailable(room.Id, DateTimeOffset.Now)
        };

        return Ok(availability);
    }
}