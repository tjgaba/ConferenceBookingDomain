using Microsoft.AspNetCore.Mvc;
using ConferenceBooking.API.Services;
using ConferenceBooking.API.DTO;
using ConferenceBooking.API.Exceptions;

[ApiController]
[Route("api/[controller]")]
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
        // Change: Replaced if/else block with exception handling for not-found errors.
        var result = _bookingManager.DeleteBooking(id);
        if (!result)
        {
            throw new InvalidBookingException($"Booking with ID {id} not found.");
        }
        return NoContent();
    }

    [HttpDelete("delete")]
    public IActionResult DeleteBooking([FromBody] DeleteBookingDTO dto)
    {
        // Change: Replaced if/else block with exception handling for not-found errors.
        var result = _bookingManager.DeleteBooking(dto.BookingId);
        if (!result)
        {
            throw new InvalidBookingException($"Booking with ID {dto.BookingId} not found.");
        }
        return NoContent();
    }
}