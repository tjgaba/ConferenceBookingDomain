using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ConferenceBooking.API.Services;
using ConferenceBooking.API.Auth;

[ApiController]
[Route("api/[controller]")]
[Authorize] // Protect all endpoints in this controller
public class CancelBookingController : ControllerBase
{
    private readonly BookingManager _bookingManager;

    public CancelBookingController(BookingManager bookingManager)
    {
        _bookingManager = bookingManager;
    }

    [HttpDelete("cancel")]
    public IActionResult CancelBooking([FromBody] CancelBookingDTO cancelBookingDTO)
    {
        try
        {
            _bookingManager.CancelBooking(cancelBookingDTO.BookingId, cancelBookingDTO.Reason);
            return NoContent();
        }
        catch (Exception ex)
        {
            return NotFound(new { Message = ex.Message });
        }
    }
}