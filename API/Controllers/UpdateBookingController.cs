using ConferenceBooking.API.Data;
using ConferenceBooking.API.DTO;
using ConferenceBooking.API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

/// <summary>
/// Controller for updating existing bookings.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize] // Protect all endpoints in this controller
public class UpdateBookingController : ControllerBase
{
    private readonly ApplicationDbContext _dbContext;

    public UpdateBookingController(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    /// <summary>
    /// Update an existing booking
    /// </summary>
    [HttpPut("update/{id}")]
    public async Task<IActionResult> UpdateBooking(int id, [FromBody] UpdateBookingDTO dto)
    {
        // Validate that the booking ID in the URL matches the DTO
        if (id != dto.BookingId)
        {
            return BadRequest(new { Message = "Booking ID in URL does not match the request body." });
        }

        // Find the existing booking
        var booking = await _dbContext.Bookings
            .Include(b => b.Room)
            .FirstOrDefaultAsync(b => b.Id == id);

        if (booking == null)
        {
            return NotFound(new { Message = $"Booking with ID {id} not found." });
        }

        // Update room if provided
        if (dto.RoomId.HasValue && dto.RoomId.Value != booking.RoomId)
        {
            var newRoom = await _dbContext.ConferenceRooms.FindAsync(dto.RoomId.Value);
            if (newRoom == null)
            {
                return BadRequest(new { Message = $"Room with ID {dto.RoomId.Value} not found." });
            }

            // Check if new room is active
            if (!newRoom.IsActive)
            {
                return BadRequest(new { Message = "The selected room is not currently available for booking." });
            }

            // Check for conflicts in the new room
            var startTime = dto.StartTime ?? booking.StartTime;
            var endTime = dto.EndTime ?? booking.EndTime;

            var hasConflict = await _dbContext.Bookings
                .Where(b => b.RoomId == dto.RoomId.Value && 
                           b.Id != id && 
                           b.Status == BookingStatus.Confirmed)
                .AnyAsync(b => b.EndTime > startTime && b.StartTime < endTime);

            if (hasConflict)
            {
                return Conflict(new { Message = "The new room is not available during the requested time." });
            }

            booking.RoomId = dto.RoomId.Value;
            booking.Room = newRoom;
        }

        // Update requested by if provided
        if (!string.IsNullOrWhiteSpace(dto.RequestedBy))
        {
            booking.RequestedBy = dto.RequestedBy;
        }

        // Update start time if provided
        if (dto.StartTime.HasValue)
        {
            var endTime = dto.EndTime ?? booking.EndTime;
            
            // Validate that start time is before end time
            if (dto.StartTime.Value >= endTime)
            {
                return BadRequest(new { Message = "Start time must be before end time." });
            }

            // Check for conflicts with the new time
            var hasConflict = await _dbContext.Bookings
                .Where(b => b.RoomId == booking.RoomId && 
                           b.Id != id && 
                           b.Status == BookingStatus.Confirmed)
                .AnyAsync(b => b.EndTime > dto.StartTime.Value && b.StartTime < endTime);

            if (hasConflict)
            {
                return Conflict(new { Message = "Room is not available during the new requested time." });
            }

            booking.StartTime = dto.StartTime.Value;
        }

        // Update end time if provided
        if (dto.EndTime.HasValue)
        {
            var startTime = dto.StartTime ?? booking.StartTime;
            
            // Validate that end time is after start time
            if (dto.EndTime.Value <= startTime)
            {
                return BadRequest(new { Message = "End time must be after start time." });
            }

            // Check for conflicts with the new time
            var hasConflict = await _dbContext.Bookings
                .Where(b => b.RoomId == booking.RoomId && 
                           b.Id != id && 
                           b.Status == BookingStatus.Confirmed)
                .AnyAsync(b => b.EndTime > startTime && b.StartTime < dto.EndTime.Value);

            if (hasConflict)
            {
                return Conflict(new { Message = "Room is not available during the new requested time." });
            }

            booking.EndTime = dto.EndTime.Value;
        }

        // Save changes to database
        await _dbContext.SaveChangesAsync();

        return Ok(new
        {
            booking.Id,
            booking.RoomId,
            RoomName = booking.Room.Name,
            booking.RequestedBy,
            booking.StartTime,
            booking.EndTime,
            Status = booking.Status.ToString()
        });
    }

    /// <summary>
    /// Update booking using request body only
    /// </summary>
    [HttpPut("update")]
    public async Task<IActionResult> UpdateBooking([FromBody] UpdateBookingDTO dto)
    {
        return await UpdateBooking(dto.BookingId, dto);
    }
}
