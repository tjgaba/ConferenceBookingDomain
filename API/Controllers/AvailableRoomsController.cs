using Microsoft.AspNetCore.Mvc;
using ConferenceBooking.API.DTO;
using ConferenceBooking.API.Services;

[ApiController]
[Route("api/[controller]ByTime")]
[Authorize]
public class AvailableRoomsController : ControllerBase
{
    private readonly BookingManager _bookingManager;

    public AvailableRoomsController(BookingManager bookingManager)
    {
        _bookingManager = bookingManager;
    }

    [HttpGet]
    public IActionResult GetAvailableRooms([FromQuery] DateTimeOffset? atTime)
    {
        var availableRooms = _bookingManager.GetAvailableRooms(atTime ?? DateTimeOffset.Now)
            .Select(room => new AvailableRoomsDTO
            {
                RoomId = room.Id,
                RoomName = room.Name,
                Capacity = room.Capacity,
                IsAvailable = true
            });

        return Ok(availableRooms);
    }
}