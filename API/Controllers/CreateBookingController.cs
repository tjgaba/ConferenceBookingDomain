using System.Threading.Tasks;
using ConferenceBooking.API.Data;
using ConferenceBooking.API.DTO;
using ConferenceBooking.API.Auth;
using ConferenceBooking.API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ConferenceBooking.API.Models;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
[Authorize] // Protect all endpoints in this controller
public class CreateBookingController : ControllerBase
{
    private readonly ApplicationDbContext _dbContext;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ILogger<CreateBookingController> _logger;

    public CreateBookingController(ApplicationDbContext dbContext, UserManager<ApplicationUser> userManager, ILogger<CreateBookingController> logger)
    {
        _dbContext = dbContext;
        _userManager = userManager;
        _logger = logger;
    }

    [HttpPost("book")]
    public async Task<IActionResult> CreateBooking([FromBody] CreateBookingRequestDTO dto)
    {
        _logger.LogInformation("CreateBooking endpoint hit");

        if (User.Identity?.Name == null)
        {
            _logger.LogWarning("User.Identity.Name is null");
            return Unauthorized();
        }

        var user = await _userManager.FindByNameAsync(User.Identity.Name);
        if (user == null)
        {
            _logger.LogWarning("User not found or unauthorized");
            return Unauthorized();
        }

        // Check if room exists
        if (!await _dbContext.ConferenceRooms.AnyAsync(r => r.Id == dto.RoomId))
        {
            return Conflict(new { Message = "Room does not exist." });
        }

        var room = await _dbContext.ConferenceRooms.FirstOrDefaultAsync(r => r.Id == dto.RoomId);
        if (room == null)
        {
            return Conflict(new { Message = "Room cannot be null when creating a booking." });
        }

        var duration = dto.EndDate - dto.StartDate;
        var endTime = dto.StartDate + duration;

        // Check for overlapping bookings
        var hasConflict = await _dbContext.Bookings
            .Where(b => b.RoomId == dto.RoomId && b.Status == BookingStatus.Confirmed)
            .AnyAsync(b => b.EndTime > dto.StartDate && b.StartTime < endTime);

        if (hasConflict)
        {
            _logger.LogWarning("Booking creation failed: Room is not available during the requested time.");
            return Conflict(new { Message = "Room is not available during the requested time." });
        }

        var booking = new Booking(
            dto.BookingId,
            room,
            user.UserName ?? "Unknown User",
            dto.StartDate,
            endTime,
            BookingStatus.Confirmed
        );

        await _dbContext.Bookings.AddAsync(booking);
        await _dbContext.SaveChangesAsync();

        _logger.LogInformation("Booking created successfully");
        return Ok(booking);
    }

    [HttpDelete("cancel/{id}")]
    public async Task<IActionResult> CancelBooking(int id)
    {
        var booking = await _dbContext.Bookings.FirstOrDefaultAsync(b => b.Id == id);
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
