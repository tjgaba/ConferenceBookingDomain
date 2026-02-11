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

        // Check if room is active
        if (!room.IsActive)
        {
            return BadRequest(new { Message = "This room is not currently available for booking." });
        }

        // Check for overlapping bookings - fetch and filter in memory to avoid LINQ translation issues
        var confirmedBookings = await _dbContext.Bookings
            .Where(b => b.RoomId == dto.RoomId && b.Status == BookingStatus.Confirmed)
            .ToListAsync();
        
        var hasConflict = confirmedBookings
            .Any(b => b.EndTime > dto.StartDate && b.StartTime < dto.EndDate);

        if (hasConflict)
        {
            _logger.LogWarning("Booking creation failed: Room is not available during the requested time.");
            return Conflict(new { Message = "Room is not available during the requested time." });
        }

        // Check if booking ID already exists
        if (await _dbContext.Bookings.AnyAsync(b => b.Id == dto.BookingId))
        {
            return Conflict(new { Message = "A booking with this ID already exists. Please use a unique booking ID." });
        }

        // Parse and validate location
        if (!Enum.TryParse<RoomLocation>(dto.Location, true, out var location))
        {
            return BadRequest(new { Message = $"Invalid location. Valid values are: {string.Join(", ", Enum.GetNames(typeof(RoomLocation)))}" });
        }

        var booking = new Booking(
            dto.BookingId,
            room,
            user.UserName ?? "Unknown User",
            dto.StartDate,
            dto.EndDate,
            BookingStatus.Pending,
            location,
            dto.Capacity
        );

        await _dbContext.Bookings.AddAsync(booking);
        await _dbContext.SaveChangesAsync();

        _logger.LogInformation("Booking created successfully with Pending status");
        return Ok(new { Message = "Booking created and pending confirmation by receptionist.", Booking = booking });
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

        booking.Cancel();
        await _dbContext.SaveChangesAsync();
        return NoContent();
    }
}
