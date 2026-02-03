using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class BookingController : ControllerBase
{
    private readonly BookingService _bookingService;

    public BookingController(BookingService bookingService)
    {
        _bookingService = bookingService;
    }

    [HttpGet("availability")]
    public IActionResult GetAvailability([FromQuery] DateTimeOffset? atTime)
    {
        var availability = _bookingService.GetAvailableRooms(atTime ?? DateTimeOffset.Now);
        return Ok(availability);
    }

    [HttpPost("book")]
    public IActionResult BookRoom([FromBody] BookingRequest request)
    {
        try
        {
            var booking = _bookingService.CreateBooking(
                request.BookingId,
                request.RoomId,
                request.RequestedBy,
                request.StartTime,
                request.Duration);

            return Ok(booking);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("cancel/{id}")]
    public IActionResult CancelBooking(int id)
    {
        try
        {
            _bookingService.CancelBooking(id);
            return NoContent();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}

public class BookingRequest
{
    public int BookingId { get; set; }
    public int RoomId { get; set; }
    public string RequestedBy { get; set; }
    public DateTimeOffset StartTime { get; set; }
    public TimeSpan Duration { get; set; }
}