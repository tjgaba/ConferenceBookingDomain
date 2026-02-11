using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ConferenceBooking.API.Data;
using ConferenceBooking.API.DTO;
using ConferenceBooking.API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    //[Authorize] // Temporarily disabled for testing
    public class ListAllRoomsController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;

        public ListAllRoomsController(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        /// <summary>
        /// Get all conference rooms with optional filtering
        /// </summary>
        /// <param name="location">Filter by location (optional)</param>
        /// <param name="activeOnly">Show only active rooms (default: true)</param>
        [HttpGet]
        public async Task<IActionResult> GetAllRooms([FromQuery] RoomLocation? location, [FromQuery] bool activeOnly = true)
        {
            var query = _dbContext.ConferenceRooms.AsQueryable();

            // Filter by active status
            if (activeOnly)
            {
                query = query.Where(r => r.IsActive);
            }

            // Filter by location if provided
            if (location.HasValue)
            {
                query = query.Where(r => r.Location == location.Value);
            }

            var rooms = await query
                .Select(r => new ListAllRoomsDTO
                {
                    Id = r.Id,
                    Name = r.Name,
                    Capacity = r.Capacity,
                    Number = r.Number,
                    Location = r.Location.ToString(),
                    IsActive = r.IsActive
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

            var roomDto = new ListAllRoomsDTO
            {
                Id = room.Id,
                Name = room.Name,
                Capacity = room.Capacity,
                Number = room.Number,
                Location = room.Location.ToString(),
                IsActive = room.IsActive
            };

            return Ok(roomDto);
        }
    }
}
