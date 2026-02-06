using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using ConferenceBooking.API.Services;
using ConferenceBooking.API.DTO;
using ConferenceBooking.API.Exceptions;

[ApiController]
[Route("api/[controller]")]
public class BookingController : ControllerBase
{
    private readonly BookingManager _bookingManager;

    public BookingController(BookingManager bookingManager)
    {
        _bookingManager = bookingManager;
    }

    [HttpGet("availability")]
    public IActionResult GetAvailability([FromQuery] DateTimeOffset? atTime)
    {
        var availability = _bookingManager.GetAvailableRooms(atTime ?? DateTimeOffset.Now);
        return Ok(availability);
    }

    [HttpPost("book")]
    public IActionResult CreateBooking([FromBody] CreateBookingRequestDTO dto)
    {
        if (dto.EndDate <= dto.StartDate)
        {
            throw new InvalidBookingException("End date must be after start date.");
        }

        var booking = new Booking(
            0, // Temporary booking ID
            new ConferenceRoom(0, "Default Room", 10), // Room object will be resolved in BookingManager
            "RequestedBy", // Placeholder for requestedBy
            dto.StartDate,
            dto.EndDate,
            BookingStatus.Confirmed
        );

        var result = _bookingManager.CreateBooking(
            booking.Id,
            booking.Room.Id,
            booking.RequestedBy,
            booking.StartTime,
            booking.EndTime - booking.StartTime
        );

        if (!result.IsSuccess)
        {
            throw new InvalidBookingException(result.ErrorMessage);
        }

        return Ok(result.Value);
    }

    [HttpDelete("cancel/{id}")]
    public IActionResult CancelBooking(int id)
    {
        _bookingManager.CancelBooking(id);
        return NoContent();
    }
}