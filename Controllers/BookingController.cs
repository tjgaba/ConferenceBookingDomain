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
        var activeBookings = _bookingService.GetActiveBookings();
        var booking = activeBookings.FirstOrDefault(b => b.Id == id);

        if (booking == null)
        {
            return NotFound("Booking not found.");
        }

        booking.Cancel();
        return Ok("Booking canceled successfully.");
    }

    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> DeleteBooking(int id, [FromQuery] string filePath)
    {
        await _bookingService.DeleteBookingAsync(id, filePath);
        return Ok("Booking deleted successfully.");
    }

    [HttpDelete("clear")]
    public async Task<IActionResult> ClearAllBookings([FromQuery] string filePath)
    {
        await _bookingService.ClearAllBookingsAsync(filePath);
        return Ok("All bookings cleared successfully.");
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