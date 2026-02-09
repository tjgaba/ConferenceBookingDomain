using Microsoft.AspNetCore.Mvc;
using ConferenceBooking.API.Services;
using ConferenceBooking.API.DTO;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class GetAllBookingsController : ControllerBase
{
    private readonly BookingManager _bookingManager;

    public GetAllBookingsController(BookingManager bookingManager)
    {
        _bookingManager = bookingManager;
    }

    [HttpGet("all")]
    public IActionResult GetAllBookings()
    {
        var bookings = _bookingManager.GetAllBookings()
            .Select(b => new GetAllBookingsDTO
            {
                BookingId = b.Id,
                RoomName = b.Room.Name,
                RequestedBy = b.RequestedBy,
                StartTime = b.StartTime,
                EndTime = b.EndTime,
                Status = b.Status.ToString()
            });
        return Ok(bookings);
    }
}