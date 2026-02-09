using Microsoft.AspNetCore.Mvc;
using ConferenceBooking.API.Services;
using ConferenceBooking.API.DTO;
using ConferenceBooking.API.Exceptions;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DeleteBookingController : ControllerBase
{
    private readonly BookingManager _bookingManager;

    public DeleteBookingController(BookingManager bookingManager)
    {
        _bookingManager = bookingManager;
    }

    [HttpDelete("delete/{id}")]
    public IActionResult DeleteBooking(int id)
    {
        var result = _bookingManager.DeleteBooking(id);
        return result ? NoContent() : NotFound(new { Message = $"Booking with ID {id} not found." });
    }

    [HttpDelete("delete")]
    public IActionResult DeleteBooking([FromBody] DeleteBookingDTO dto)
    {
        var result = _bookingManager.DeleteBooking(dto.BookingId);
        return result ? NoContent() : NotFound(new { Message = $"Booking with ID {dto.BookingId} not found." });
    }
}