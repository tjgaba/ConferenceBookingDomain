using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ConferenceBooking.API.Data;
using ConferenceBooking.API.DTO;
using ConferenceBooking.API.Entities;
using ConferenceBooking.API.Services;
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
        private readonly RoomManagementService _roomManagementService;

        public RoomManagementController(ApplicationDbContext dbContext, RoomManagementService roomManagementService)
        {
            _dbContext = dbContext;
            _roomManagementService = roomManagementService;
        }

        /// <summary>
        /// Update a room's active status
        /// </summary>
        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateRoomStatus(int id, [FromBody] UpdateRoomStatusDTO request)
        {
            var validation = await _roomManagementService.ValidateRoomStatusChangeAsync(id, request.IsActive);
            if (!validation.isValid) return BadRequest(new { message = validation.errorMessage });

            var room = validation.room!;
            _roomManagementService.ApplyStatusChange(room, request.IsActive);
            await _dbContext.SaveChangesAsync();

            return Ok(new
            {
                room.Id,
                room.Name,
                room.IsActive,
                room.DeletedAt,
                message = $"Room status updated to {(room.IsActive ? "Active" : "Inactive")}"
            });
        }

        /// <summary>
        /// Update room details
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRoom(int id, [FromBody] UpdateRoomDTO request)
        {
            var validation = await _roomManagementService.ValidateRoomUpdateAsync(id);
            if (!validation.isValid) return NotFound(new { message = validation.errorMessage });

            var room = validation.room!;
            var updateResult = await _roomManagementService.ApplyRoomUpdates(room, request);
            if (!updateResult.isValid) return BadRequest(new { message = updateResult.errorMessage });

            await _dbContext.SaveChangesAsync();

            return Ok(new
            {
                room.Id,
                room.Name,
                room.Capacity,
                room.Number,
                Location = room.Location.ToString(),
                room.IsActive,
                message = "Room updated successfully"
            });
        }

        /// <summary>
        /// Create a new conference room
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> CreateRoom([FromBody] CreateRoomDTO request)
        {
            var validation = _roomManagementService.ValidateRoomCreation(request.Name, request.Capacity);
            if (!validation.isValid) return BadRequest(new { message = validation.errorMessage });

            var room = new ConferenceRoom
            {
                Name = request.Name,
                Capacity = request.Capacity,
                Number = request.Number,
                Location = request.Location,
                IsActive = request.IsActive
            };

            await _dbContext.ConferenceRooms.AddAsync(room);
            await _dbContext.SaveChangesAsync();

            return CreatedAtAction(
                "GetRoomById",
                "Room",
                new { id = room.Id },
                new
                {
                    room.Id,
                    room.Name,
                    room.Capacity,
                    room.Number,
                    Location = room.Location.ToString(),
                    room.IsActive,
                    message = "Room created successfully"
                });
        }

        /// <summary>
        /// Deactivate a room (soft delete)
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeactivateRoom(int id)
        {
            var validation = await _roomManagementService.ValidateRoomStatusChangeAsync(id, false);
            if (!validation.isValid) return BadRequest(new { message = validation.errorMessage });

            var room = validation.room!;
            _roomManagementService.ApplyStatusChange(room, false);
            await _dbContext.SaveChangesAsync();

            return Ok(new
            {
                room.Id,
                room.Name,
                room.IsActive,
                message = "Room deactivated successfully"
            });
        }
    }
}
