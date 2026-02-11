using System.Linq;
using System.Threading.Tasks;
using ConferenceBooking.API.Data;
using ConferenceBooking.API.DTO;
using ConferenceBooking.API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace ConferenceBooking.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Receptionist,Admin")]
    public class ConfirmBookingController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly ILogger<ConfirmBookingController> _logger;

        public ConfirmBookingController(ApplicationDbContext dbContext, ILogger<ConfirmBookingController> logger)
        {
            _dbContext = dbContext;
            _logger = logger;
        }

        [HttpPatch("{id}")]
        public async Task<IActionResult> ConfirmBooking(int id)
        {
            var booking = await _dbContext.Bookings
                .Include(b => b.Room)
                .FirstOrDefaultAsync(b => b.Id == id);
                
            if (booking == null)
            {
                return NotFound(new { Message = "Booking not found." });
            }

            if (booking.Status == BookingStatus.Confirmed)
            {
                return BadRequest(new { Message = "Booking is already confirmed." });
            }

            if (booking.Status == BookingStatus.Cancelled)
            {
                return BadRequest(new { Message = "Cannot confirm a cancelled booking." });
            }

            // Check for conflicts with confirmed bookings before confirming
            var confirmedBookings = await _dbContext.Bookings
                .Where(b => b.RoomId == booking.RoomId && b.Status == BookingStatus.Confirmed)
                .ToListAsync();
            
            var hasConflict = confirmedBookings
                .Any(b => b.EndTime > booking.StartTime && b.StartTime < booking.EndTime);

            if (hasConflict)
            {
                return Conflict(new { Message = "Cannot confirm: Room is not available during the requested time." });
            }

            booking.Confirm();
            await _dbContext.SaveChangesAsync();
            
            _logger.LogInformation($"Booking {id} confirmed by {User.Identity?.Name}");
            return Ok(new { Message = "Booking confirmed successfully.", Booking = booking });
        }

        [HttpPost("confirm")]
        public async Task<IActionResult> ConfirmBookingByDto([FromBody] ConfirmBookingDTO dto)
        {
            return await ConfirmBooking(dto.BookingId);
        }
    }
}
