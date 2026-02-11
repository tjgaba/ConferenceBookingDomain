using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ConferenceBooking.API.Data;
using ConferenceBooking.API.Entities;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin,FacilityManager")] // Admins and Facility Managers can manage rooms
    public class RoomManagementController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;

        public RoomManagementController(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        /// <summary>
        /// Update a room's active status
        /// </summary>
        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateRoomStatus(int id, [FromBody] UpdateRoomStatusRequest request)
        {
            var room = await _dbContext.ConferenceRooms.FindAsync(id);
            if (room == null)
            {
                return NotFound(new { Message = $"Room with ID {id} not found." });
            }

            room.IsActive = request.IsActive;
            await _dbContext.SaveChangesAsync();

            return Ok(new
            {
                room.Id,
                room.Name,
                room.IsActive,
                Message = $"Room status updated to {(room.IsActive ? "Active" : "Inactive")}"
            });
        }

        /// <summary>
        /// Update room details
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRoom(int id, [FromBody] UpdateRoomRequest request)
        {
            var room = await _dbContext.ConferenceRooms.FindAsync(id);
            if (room == null)
            {
                return NotFound(new { Message = $"Room with ID {id} not found." });
            }

            if (!string.IsNullOrWhiteSpace(request.Name))
            {
                room.Name = request.Name;
            }

            if (request.Capacity.HasValue && request.Capacity.Value > 0)
            {
                room.Capacity = request.Capacity.Value;
            }

            if (request.Number.HasValue)
            {
                room.Number = request.Number.Value;
            }

            if (request.Location.HasValue)
            {
                room.Location = request.Location.Value;
            }

            if (request.IsActive.HasValue)
            {
                room.IsActive = request.IsActive.Value;
            }

            await _dbContext.SaveChangesAsync();

            return Ok(new
            {
                room.Id,
                room.Name,
                room.Capacity,
                room.Number,
                Location = room.Location.ToString(),
                room.IsActive,
                Message = "Room updated successfully"
            });
        }

        /// <summary>
        /// Create a new conference room
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> CreateRoom([FromBody] CreateRoomRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Name))
            {
                return BadRequest(new { Message = "Room name is required." });
            }

            if (request.Capacity <= 0)
            {
                return BadRequest(new { Message = "Room capacity must be greater than 0." });
            }

            var room = new ConferenceRoom
            {
                Name = request.Name,
                Capacity = request.Capacity,
                Number = request.Number,
                Location = request.Location,
                IsActive = request.IsActive ?? true
            };

            await _dbContext.ConferenceRooms.AddAsync(room);
            await _dbContext.SaveChangesAsync();

            return CreatedAtAction(
                nameof(ListAllRoomsController.GetRoomById),
                "ListAllRooms",
                new { id = room.Id },
                new
                {
                    room.Id,
                    room.Name,
                    room.Capacity,
                    room.Number,
                    Location = room.Location.ToString(),
                    room.IsActive,
                    Message = "Room created successfully"
                });
        }

        /// <summary>
        /// Deactivate a room (soft delete)
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeactivateRoom(int id)
        {
            var room = await _dbContext.ConferenceRooms.FindAsync(id);
            if (room == null)
            {
                return NotFound(new { Message = $"Room with ID {id} not found." });
            }

            // Check if there are any active bookings for this room
            var hasActiveBookings = await _dbContext.Bookings
                .AnyAsync(b => b.RoomId == id && 
                              b.Status == BookingStatus.Confirmed && 
                              b.EndTime > DateTimeOffset.Now);

            if (hasActiveBookings)
            {
                return BadRequest(new 
                { 
                    Message = "Cannot deactivate room with active bookings. Please cancel or wait for bookings to complete." 
                });
            }

            room.IsActive = false;
            await _dbContext.SaveChangesAsync();

            return Ok(new
            {
                room.Id,
                room.Name,
                room.IsActive,
                Message = "Room deactivated successfully"
            });
        }
    }

    // DTOs for room management
    public class UpdateRoomStatusRequest
    {
        public bool IsActive { get; set; }
    }

    public class UpdateRoomRequest
    {
        public string? Name { get; set; }
        public int? Capacity { get; set; }
        public int? Number { get; set; }
        public RoomLocation? Location { get; set; }
        public bool? IsActive { get; set; }
    }

    public class CreateRoomRequest
    {
        public string Name { get; set; } = string.Empty;
        public int Capacity { get; set; }
        public int Number { get; set; }
        public RoomLocation Location { get; set; }
        public bool? IsActive { get; set; }
    }
}
