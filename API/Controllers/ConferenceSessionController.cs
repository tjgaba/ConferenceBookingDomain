using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using ConferenceBooking.API.DTO;
using ConferenceBooking.API.Entities;
using ConferenceBooking.API.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConferenceBooking.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // Require authentication - Admin has access to all endpoints
    public class ConferenceSessionController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly SessionManagementService _sessionService;

        public ConferenceSessionController(ApplicationDbContext context, SessionManagementService sessionService)
        {
            _context = context;
            _sessionService = sessionService;
        }

        /// <summary>
        /// Get all conference sessions
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SessionResponseDTO>>> GetAllSessions()
        {
            var sessions = await _context.ConferenceSessions
                .Include(s => s.Room)
                .Select(s => new SessionResponseDTO
                {
                    Id = s.Id,
                    Title = s.Title,
                    Description = s.Description,
                    Capacity = s.Capacity,
                    StartTime = s.StartTime,
                    EndTime = s.EndTime,
                    RoomId = s.RoomId,
                    RoomName = s.Room != null ? s.Room.Name : null,
                    RoomLocation = s.Room != null ? s.Room.Location.ToString() : null
                })
                .ToListAsync();

            return Ok(sessions);
        }

        /// <summary>
        /// Get session by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<SessionResponseDTO>> GetSession(int id)
        {
            var session = await _context.ConferenceSessions
                .Include(s => s.Room)
                .Where(s => s.Id == id)
                .Select(s => new SessionResponseDTO
                {
                    Id = s.Id,
                    Title = s.Title,
                    Description = s.Description,
                    Capacity = s.Capacity,
                    StartTime = s.StartTime,
                    EndTime = s.EndTime,
                    RoomId = s.RoomId,
                    RoomName = s.Room != null ? s.Room.Name : null,
                    RoomLocation = s.Room != null ? s.Room.Location.ToString() : null
                })
                .FirstOrDefaultAsync();

            if (session == null)
            {
                return NotFound(new { message = $"Session with ID {id} not found" });
            }

            return Ok(session);
        }

        /// <summary>
        /// Create a new session - Admin only
        /// </summary>
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<SessionResponseDTO>> CreateSession([FromBody] CreateSessionDTO dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var validation = await _sessionService.ValidateSessionCreationAsync(dto);
            if (!validation.isValid) return BadRequest(new { message = validation.errorMessage });

            var session = new ConferenceSession
            {
                Title = dto.Title,
                Description = dto.Description,
                Capacity = dto.Capacity,
                StartTime = dto.StartTime,
                EndTime = dto.EndTime,
                RoomId = dto.RoomId
            };

            _context.ConferenceSessions.Add(session);
            await _context.SaveChangesAsync();

            // Load the room data if associated
            if (session.RoomId.HasValue)
            {
                await _context.Entry(session).Reference(s => s.Room).LoadAsync();
            }

            var response = new SessionResponseDTO
            {
                Id = session.Id,
                Title = session.Title,
                Description = session.Description,
                Capacity = session.Capacity,
                StartTime = session.StartTime,
                EndTime = session.EndTime,
                RoomId = session.RoomId,
                RoomName = session.Room?.Name,
                RoomLocation = session.Room?.Location.ToString()
            };

            return CreatedAtAction(nameof(GetSession), new { id = session.Id }, response);
        }

        /// <summary>
        /// Update an existing session
        /// </summary>
        [HttpPut("{id}")]
        public async Task<ActionResult<SessionResponseDTO>> UpdateSession(int id, [FromBody] UpdateSessionDTO dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var validation = await _sessionService.ValidateSessionUpdateAsync(id, dto);
            if (!validation.isValid) return BadRequest(new { message = validation.errorMessage });

            var session = await _context.ConferenceSessions.FindAsync(id);
            if (session == null) return NotFound(new { message = $"Session with ID {id} not found" });

            session.Title = dto.Title;
            session.Description = dto.Description;
            session.Capacity = dto.Capacity;
            session.StartTime = dto.StartTime;
            session.EndTime = dto.EndTime;
            session.RoomId = dto.RoomId;

            await _context.SaveChangesAsync();

            // Load the room data if associated
            if (session.RoomId.HasValue)
            {
                await _context.Entry(session).Reference(s => s.Room).LoadAsync();
            }

            var response = new SessionResponseDTO
            {
                Id = session.Id,
                Title = session.Title,
                Description = session.Description,
                Capacity = session.Capacity,
                StartTime = session.StartTime,
                EndTime = session.EndTime,
                RoomId = session.RoomId,
                RoomName = session.Room?.Name,
                RoomLocation = session.Room?.Location.ToString()
            };

            return Ok(response);
        }

        /// <summary>
        /// Delete a session
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteSession(int id)
        {
            var validation = await _sessionService.ValidateSessionDeletionAsync(id);
            if (!validation.isValid) return NotFound(new { message = validation.errorMessage });

            var session = await _context.ConferenceSessions.FindAsync(id);
            if (session == null) return NotFound(new { message = $"Session with ID {id} not found" });

            _context.ConferenceSessions.Remove(session);
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Session {session.Title} deleted successfully" });
        }

        /// <summary>
        /// Get sessions by room ID
        /// </summary>
        [HttpGet("room/{roomId}")]
        public async Task<ActionResult<IEnumerable<SessionResponseDTO>>> GetSessionsByRoom(int roomId)
        {
            var validation = await _sessionService.ValidateRoomExistsAsync(roomId);
            if (!validation.isValid) return NotFound(new { message = validation.errorMessage });

            var sessions = await _context.ConferenceSessions
                .Include(s => s.Room)
                .Where(s => s.RoomId == roomId)
                .Select(s => new SessionResponseDTO
                {
                    Id = s.Id,
                    Title = s.Title,
                    Description = s.Description,
                    Capacity = s.Capacity,
                    StartTime = s.StartTime,
                    EndTime = s.EndTime,
                    RoomId = s.RoomId,
                    RoomName = s.Room != null ? s.Room.Name : null,
                    RoomLocation = s.Room != null ? s.Room.Location.ToString() : null
                })
                .ToListAsync();

            return Ok(sessions);
        }

        /// <summary>
        /// Get sessions without assigned rooms
        /// </summary>
        [HttpGet("unassigned")]
        public async Task<ActionResult<IEnumerable<SessionResponseDTO>>> GetUnassignedSessions()
        {
            var sessions = await _context.ConferenceSessions
                .Where(s => s.RoomId == null)
                .Select(s => new SessionResponseDTO
                {
                    Id = s.Id,
                    Title = s.Title,
                    Description = s.Description,
                    Capacity = s.Capacity,
                    StartTime = s.StartTime,
                    EndTime = s.EndTime,
                    RoomId = null,
                    RoomName = null,
                    RoomLocation = null
                })
                .ToListAsync();

            return Ok(sessions);
        }
    }
}
