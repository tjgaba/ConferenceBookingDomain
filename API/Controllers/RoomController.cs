using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ConferenceBooking.API.Data;
using ConferenceBooking.API.DTO;
using ConferenceBooking.API.Entities;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using System;

namespace ConferenceBooking.API.Controllers
{
    /// <summary>
    /// Controller for listing rooms and checking room availability
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class RoomController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;

        public RoomController(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        #region GET Endpoints - Room Listing

        /// <summary>
        /// Get all conference rooms with optional filtering and pagination
        /// By default, only active rooms are returned to prevent showing soft-deleted rooms
        /// Query Discipline: Filters at database level, uses projection, supports pagination
        /// </summary>
        /// <param name="location">Filter by location (optional)</param>
        /// <param name="isActive">Filter by active status: true = active only (default), false = inactive only, null = all rooms (optional)</param>
        /// <param name="page">Page number (default: 1)</param>
        /// <param name="pageSize">Items per page (default: 50, max: 100)</param>
        [HttpGet]
        public async Task<IActionResult> GetAllRooms(
            [FromQuery] RoomLocation? location, 
            [FromQuery] bool? isActive = true,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 50)
        {
            // Validate pagination parameters
            if (page < 1) page = 1;
            if (pageSize < 1) pageSize = 50;
            if (pageSize > 100) pageSize = 100;

            var query = _dbContext.ConferenceRooms
                .AsNoTracking() // Read-only query optimization
                .AsQueryable();

            // Filter by active status - defaults to true (active only)
            if (isActive.HasValue)
            {
                query = query.Where(r => r.IsActive == isActive.Value);
            }

            // Filter by location if provided
            if (location.HasValue)
            {
                query = query.Where(r => r.Location == location.Value);
            }

            // Get total count for pagination
            var totalCount = await query.CountAsync();

            // Apply pagination and projection at database level
            var rooms = await query
                .OrderBy(r => r.Location)
                .ThenBy(r => r.Number)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(r => new ListAllRoomsDTO
                {
                    Id = r.Id,
                    Name = r.Name,
                    Capacity = r.Capacity,
                    Number = r.Number,
                    Location = r.Location.ToString(),
                    IsActive = r.IsActive,
                    DeletedAt = r.DeletedAt
                })
                .ToListAsync();

            // Return paginated response
            var response = new PaginatedResponseDTO<ListAllRoomsDTO>
            {
                Data = rooms,
                CurrentPage = page,
                PageSize = pageSize,
                TotalRecords = totalCount,
                TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
            };

            return Ok(response);
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

            var roomDto = new RoomDetailDTO
            {
                Id = room.Id,
                Name = room.Name,
                Capacity = room.Capacity,
                Number = room.Number,
                Location = room.Location.ToString(),
                IsActive = room.IsActive,
                DeletedAt = room.DeletedAt
            };

            return Ok(roomDto);
        }

        #endregion

        #region GET Endpoints - Room Availability

        /// <summary>
        /// Get availability of a specific room by room ID
        /// </summary>
        [HttpGet("{id}/availability")]
        [HttpGet("availability/ByRoomNumber")]
        [Authorize]
        public async Task<IActionResult> GetAvailabilityByRoomNumber([FromQuery] int? roomId, int? id)
        {
            int targetRoomId = id ?? roomId ?? 0;
            
            if (targetRoomId == 0)
            {
                return BadRequest(new { Message = "Room ID is required." });
            }

            var room = await _dbContext.ConferenceRooms.FindAsync(targetRoomId);
            if (room == null)
            {
                return NotFound(new { Message = $"Room with ID {targetRoomId} not found." });
            }

            if (!room.IsActive)
            {
                return BadRequest(new { Message = "This room is not currently active." });
            }

            var isAvailable = !await _dbContext.Bookings.AnyAsync(b =>
                b.RoomId == targetRoomId &&
                b.Status == BookingStatus.Confirmed &&
                b.StartTime <= DateTimeOffset.Now &&
                DateTimeOffset.Now < b.EndTime);

            var availability = new CheckAvailableRoomsDTO
            {
                RoomId = room.Id,
                RoomName = room.Name,
                Capacity = room.Capacity,
                IsAvailable = isAvailable
            };

            return Ok(availability);
        }

        /// <summary>
        /// Get all available rooms at a specific time
        /// </summary>
        [HttpGet("availability")]
        [HttpGet("availability/ByTime")]
        [Authorize]
        public async Task<IActionResult> GetAvailableRoomsByTime([FromQuery] DateTimeOffset? atTime)
        {
            var requestedTime = atTime ?? DateTimeOffset.Now;

            var availableRooms = await _dbContext.ConferenceRooms
                .Where(room => room.IsActive && !_dbContext.Bookings.Any(b =>
                    b.RoomId == room.Id &&
                    b.Status == BookingStatus.Confirmed &&
                    b.StartTime <= requestedTime &&
                    requestedTime < b.EndTime))
                .Select(room => new CheckAvailableRoomsDTO
                {
                    RoomId = room.Id,
                    RoomName = room.Name,
                    Capacity = room.Capacity,
                    IsAvailable = true
                })
                .ToListAsync();

            return Ok(availableRooms);
        }

        #endregion
    }
}
