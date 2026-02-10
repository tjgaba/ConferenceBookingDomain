using ConferenceBooking.API.Data;
using ConferenceBooking.API.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
[Authorize] 
public class GetAllBookingsController : ControllerBase
{
    private readonly ApplicationDbContext _dbContext;

    public GetAllBookingsController(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet("all")]
    public async Task<IActionResult> GetAllBookings()
    {
        var bookings = await _dbContext.Bookings
            .Include(b => b.Room)
            .Select(b => new GetAllBookingsDTO
            {
                BookingId = b.Id,
                RoomName = b.Room.Name,
                RequestedBy = b.RequestedBy,
                StartTime = b.StartTime,
                EndTime = b.EndTime,
                Status = b.Status.ToString(),
                CreatedAt = b.CreatedAt,
                CancelledAt = b.CancelledAt
            })
            .ToListAsync();

        return Ok(bookings);
    }
}