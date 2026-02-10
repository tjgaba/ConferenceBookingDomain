using ConferenceBooking.API.Services;
using ConferenceBooking.API.DTO;
using ConferenceBooking.API.Auth;
using ConferenceBooking.API.Exceptions;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
[Authorize] // Protect all endpoints in this controller
public class DeleteBookingController : ControllerBase
{
    private readonly BookingManager _bookingManager;

    public DeleteBookingController(BookingManager bookingManager)
    {
        _bookingManager = bookingManager;
    }

    [HttpDelete("delete/{id}")]
    [Authorize(Roles = "Admin")] // Only Admin can delete bookings
    public IActionResult DeleteBooking(int id)
    {
        var result = _bookingManager.DeleteBooking(id);
        return result ? NoContent() : NotFound(new { Message = $"Booking with ID {id} not found." });
    }

    [HttpDelete("delete")]
    [Authorize(Roles = "Admin")] // Only Admin can delete bookings
    public IActionResult DeleteBooking([FromBody] DeleteBookingDTO dto)
    {
        var result = _bookingManager.DeleteBooking(dto.BookingId);
        return result ? NoContent() : NotFound(new { Message = $"Booking with ID {dto.BookingId} not found." });
    }
}