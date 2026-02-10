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
    public async Task<IActionResult> CancelBooking([FromBody] CancelBookingDTO cancelBookingDTO)
    {
        try
        {
            await _bookingManager.CancelBookingAsync(cancelBookingDTO.BookingId);
            return NoContent();
        }
        catch (Exception ex)
        {
            return NotFound(new { Message = ex.Message });
        }
    }
}