using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ConferenceBooking.API.Data;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class RoomsController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;

        public RoomsController(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        /// <summary>
        /// Get all conference rooms
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetAllRooms()
        {
            var rooms = await _dbContext.ConferenceRooms
                .Select(r => new
                {
                    r.Id,
                    r.Name,
                    r.Capacity,
                    r.Number
                })
                .ToListAsync();

            return Ok(rooms);
        }

        /// <summary>
        /// Get a specific room by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetRoomById(int id)
        {
            var room = await _dbContext.ConferenceRooms.FindAsync(id);
            
            if (room == null)
            {
                return NotFound(new { Message = $"Room with ID {id} not found." });
            }

            return Ok(new
            {
                room.Id,
                room.Name,
                room.Capacity,
                room.Number
            });
        }
    }
}
