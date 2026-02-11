using ConferenceBooking.API.Data;
using ConferenceBooking.API.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
[Authorize] // Protect all endpoints in this controller
public class DeleteBookingController : ControllerBase
{
    private readonly ApplicationDbContext _dbContext;

    public DeleteBookingController(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpDelete("delete/{id}")]
    [Authorize(Roles = "Admin")] // Only Admin can delete bookings
    public async Task<IActionResult> DeleteBooking(int id)
    {
        var booking = await _dbContext.Bookings.FirstOrDefaultAsync(b => b.Id == id);
        if (booking == null)
        {
            return NotFound(new { Message = $"Booking with ID {id} not found." });
        }

        _dbContext.Bookings.Remove(booking);
        await _dbContext.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("delete")]
    [Authorize(Roles = "Admin")] // Only Admin can delete bookings
    public async Task<IActionResult> DeleteBooking([FromBody] DeleteBookingDTO dto)
    {
        var booking = await _dbContext.Bookings.FirstOrDefaultAsync(b => b.Id == dto.BookingId);
        if (booking == null)
        {
            return NotFound(new { Message = $"Booking with ID {dto.BookingId} not found." });
        }

        _dbContext.Bookings.Remove(booking);
        await _dbContext.SaveChangesAsync();
        return NoContent();
    }
}