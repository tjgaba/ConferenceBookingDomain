using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using ConferenceBooking.API.Services;
using ConferenceBooking.API.DTO;

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
            return UnprocessableEntity("End date must be after start date.");
        }

        var availableRooms = _bookingManager.GetAvailableRooms(dto.StartDate);
        if (!availableRooms.Any())
        {
            return UnprocessableEntity("No rooms are available for the requested time.");
        }

        var room = availableRooms.First(); // Select the first available room

        var booking = new Booking(
            0, // Temporary booking ID
            room, // Use the resolved room
            "RequestedBy", // Placeholder for requestedBy
            dto.StartDate,
            dto.EndDate,
            BookingStatus.Confirmed
        );

        var result = _bookingManager.CreateBooking(
            booking.Id,
            booking.Room.Id, // Room.Id is now resolved
            booking.RequestedBy,
            booking.StartTime,
            booking.EndTime - booking.StartTime
        );

        if (!result.IsSuccess)
        {
            return UnprocessableEntity(result.ErrorMessage);
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