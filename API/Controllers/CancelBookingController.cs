using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ConferenceBooking.API.Data;
using ConferenceBooking.API.DTO;
using ConferenceBooking.API.Entities;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
[Authorize] // Protect all endpoints in this controller
public class CancelBookingController : ControllerBase
{
    private readonly ApplicationDbContext _dbContext;

    public CancelBookingController(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpDelete("cancel")]
    public async Task<IActionResult> CancelBooking([FromBody] CancelBookingDTO cancelBookingDTO)
    {
        var booking = await _dbContext.Bookings.FirstOrDefaultAsync(b => b.Id == cancelBookingDTO.BookingId);
        if (booking == null)
        {
            return NotFound(new { Message = "Booking not found." });
        }

        if (booking.Status == BookingStatus.Cancelled)
        {
            return BadRequest(new { Message = "Booking is already cancelled." });
        }

        booking.Status = BookingStatus.Cancelled;
        await _dbContext.SaveChangesAsync();
        return NoContent();
    }
}