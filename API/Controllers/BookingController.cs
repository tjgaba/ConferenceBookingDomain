using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class BookingController : ControllerBase
{
    private readonly BookingService _bookingService;
    private readonly BookRoomHandler _bookRoomHandler;
    private readonly ViewAvailabilityHandler _viewHandler;

    public BookingController(BookingService bookingService, BookRoomHandler bookRoomHandler, ViewAvailabilityHandler viewHandler)
    {
        _bookingService = bookingService;
        _bookRoomHandler = bookRoomHandler;
        _viewHandler = viewHandler;
    }

    [HttpGet("availability")]
    public IActionResult GetAvailability([FromQuery] DateTimeOffset? atTime)
    {
        var availability = _viewHandler.GetAvailability(_bookingService, atTime ?? DateTimeOffset.Now);
        return Ok(availability);
    }

    [HttpPost("book")]
    public async Task<IActionResult> BookRoom([FromBody] BookingRequest request)
    {
        try
        {
            var booking = _bookRoomHandler.BookRoomNonInteractive(
                _bookingService,
                request.BookingId == 0 ? null : (int?)request.BookingId,
                request.RoomId,
                request.RequestedBy,
                request.StartTime,
                request.Duration);

            // persist bookings after successful creation
            await ConferenceBooking.Persistence.BookingFileStore.SaveAsync(_bookingService.GetAllBookings());

            return Ok(booking);
        }
        catch (ArgumentException ex)
        {
            return NotFound(ex.Message);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(ex.Message);
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