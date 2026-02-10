using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ConferenceBooking.API.Data;
using ConferenceBooking.API.DTO;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ListAllRoomsController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;

        public ListAllRoomsController(ApplicationDbContext dbContext)
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
                .Select(r => new ListAllRoomsDTO
                {
                    Id = r.Id,
                    Name = r.Name,
                    Capacity = r.Capacity,
                    Number = r.Number
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
                Number = room.Number
            };

            return Ok(roomDto);
        }
    }
}
