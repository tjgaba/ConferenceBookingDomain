using System.Linq;
using System.Threading.Tasks;
using ConferenceBooking.API.Data;
using ConferenceBooking.API.DTO;
using ConferenceBooking.API.Auth;
using ConferenceBooking.API.Entities;
using ConferenceBooking.API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;

namespace ConferenceBooking.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class BookingController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger<BookingController> _logger;
        private readonly BookingRepository _bookingRepository;

        public BookingController(
            ApplicationDbContext dbContext,
            UserManager<ApplicationUser> userManager,
            ILogger<BookingController> logger,
            BookingRepository bookingRepository)
        {
            _dbContext = dbContext;
            _userManager = userManager;
            _logger = logger;
            _bookingRepository = bookingRepository;
        }

        #region GET Endpoints

        /// <summary>
        /// Get all bookings
        /// </summary>
        [HttpGet]
        [HttpGet("all")]
        public async Task<IActionResult> GetAllBookings()
        {
            var bookings = await _dbContext.Bookings
                .Include(b => b.Room)
                .Select(b => new GetAllBookingsDTO
                {
                    BookingId = b.Id,
                    RoomName = b.Room.Name,
                    RoomNumber = b.Room.Number,
                    Location = b.Location.ToString(),
                    IsActive = b.Room.IsActive,
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

        /// <summary>
        /// Get booking by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetBookingById(int id)
        {
            var booking = await _dbContext.Bookings
                .Include(b => b.Room)
                .Where(b => b.Id == id)
                .Select(b => new GetAllBookingsDTO
                {
                    BookingId = b.Id,
                    RoomName = b.Room.Name,
                    RoomNumber = b.Room.Number,
                    Location = b.Location.ToString(),
                    IsActive = b.Room.IsActive,
                    RequestedBy = b.RequestedBy,
                    StartTime = b.StartTime,
                    EndTime = b.EndTime,
                    Status = b.Status.ToString(),
                    CreatedAt = b.CreatedAt,
                    CancelledAt = b.CancelledAt
                })
                .FirstOrDefaultAsync();

            if (booking == null)
            {
                return NotFound(new { Message = $"Booking with ID {id} not found." });
            }

            return Ok(booking);
        }

        /// <summary>
        /// Get filtered bookings by room, location, date range, and/or room active status.
        /// All filtering happens at the database level for optimal performance.
        /// Examples:
        /// - GET /api/booking/filter?roomName=Room A
        /// - GET /api/booking/filter?location=CapeTown
        /// - GET /api/booking/filter?startDate=2026-02-01&endDate=2026-02-28
        /// - GET /api/booking/filter?isActiveRoom=true
        /// - GET /api/booking/filter?roomName=Room A&location=London&isActiveRoom=true
        /// </summary>
        [HttpGet("filter")]
        public async Task<IActionResult> GetFilteredBookings([FromQuery] FilterBookingsDTO filter)
        {
            _logger.LogInformation("Filtering bookings with criteria: RoomName={RoomName}, Location={Location}, StartDate={StartDate}, EndDate={EndDate}, IsActiveRoom={IsActiveRoom}, Status={Status}",
                filter.RoomName, filter.Location, filter.StartDate, filter.EndDate, filter.IsActiveRoom, filter.Status);

            var bookings = await _bookingRepository.GetFilteredBookingsAsync(filter);

            var result = bookings.Select(b => new GetAllBookingsDTO
            {
                BookingId = b.Id,
                RoomName = b.Room.Name,
                RoomNumber = b.Room.Number,
                Location = b.Location.ToString(),
                IsActive = b.Room.IsActive,
                RequestedBy = b.RequestedBy,
                StartTime = b.StartTime,
                EndTime = b.EndTime,
                Status = b.Status.ToString(),
                CreatedAt = b.CreatedAt,
                CancelledAt = b.CancelledAt
            }).ToList();

            _logger.LogInformation("Found {Count} bookings matching the filter criteria", result.Count);

            return Ok(new 
            { 
                Count = result.Count,
                Filters = new 
                {
                    RoomName = filter.RoomName,
                    Location = filter.Location?.ToString(),
                    StartDate = filter.StartDate,
                    EndDate = filter.EndDate,
                    IsActiveRoom = filter.IsActiveRoom,
                    Status = filter.Status
                },
                Bookings = result 
            });
        }

        #endregion

        #region POST Endpoints

        /// <summary>
        /// Create a new booking
        /// </summary>
        [HttpPost]
        [HttpPost("book")]
        public async Task<IActionResult> CreateBooking([FromBody] CreateBookingRequestDTO dto)
        {
            _logger.LogInformation("CreateBooking endpoint hit");

            if (User.Identity?.Name == null)
            {
                _logger.LogWarning("User.Identity.Name is null");
                return Unauthorized();
            }

            var user = await _userManager.FindByNameAsync(User.Identity.Name);
            if (user == null)
            {
                _logger.LogWarning("User not found or unauthorized");
                return Unauthorized();
            }

            // Check if room exists
            if (!await _dbContext.ConferenceRooms.AnyAsync(r => r.Id == dto.RoomId))
            {
                return Conflict(new { Message = "Room does not exist." });
            }

            var room = await _dbContext.ConferenceRooms.FirstOrDefaultAsync(r => r.Id == dto.RoomId);
            if (room == null)
            {
                return Conflict(new { Message = "Room cannot be null when creating a booking." });
            }

            // Check if room is active
            if (!room.IsActive)
            {
                return BadRequest(new { Message = "This room is not currently available for booking." });
            }

            // Check for overlapping bookings - fetch and filter in memory to avoid LINQ translation issues
            var confirmedBookings = await _dbContext.Bookings
                .Where(b => b.RoomId == dto.RoomId && b.Status == BookingStatus.Confirmed)
                .ToListAsync();
            
            var hasConflict = confirmedBookings
                .Any(b => b.EndTime > dto.StartDate && b.StartTime < dto.EndDate);

            if (hasConflict)
            {
                _logger.LogWarning("Booking creation failed: Room is not available during the requested time.");
                return Conflict(new { Message = "Room is not available during the requested time." });
            }

            // Check if booking ID already exists
            if (await _dbContext.Bookings.AnyAsync(b => b.Id == dto.BookingId))
            {
                return Conflict(new { Message = "A booking with this ID already exists. Please use a unique booking ID." });
            }

            // Parse and validate location
            if (!Enum.TryParse<RoomLocation>(dto.Location, true, out var location))
            {
                return BadRequest(new { Message = $"Invalid location. Valid values are: {string.Join(", ", Enum.GetNames(typeof(RoomLocation)))}" });
            }

            var booking = new Booking(
                dto.BookingId,
                room,
                user.UserName ?? "Unknown User",
                dto.StartDate,
                dto.EndDate,
                BookingStatus.Pending,
                location,
                dto.Capacity
            );

            await _dbContext.Bookings.AddAsync(booking);
            await _dbContext.SaveChangesAsync();

            _logger.LogInformation("Booking created successfully with Pending status");
            return Ok(new { Message = "Booking created and pending confirmation by receptionist.", Booking = booking });
        }

        #endregion

        #region PUT/PATCH Endpoints

        /// <summary>
        /// Update an existing booking
        /// </summary>
        [HttpPut("{id}")]
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

                // Check for conflicts in the new room - fetch and filter in memory to avoid LINQ translation issues
                var startTime = dto.StartTime ?? booking.StartTime;
                var endTime = dto.EndTime ?? booking.EndTime;

                var confirmedBookings = await _dbContext.Bookings
                    .Where(b => b.RoomId == dto.RoomId.Value && 
                               b.Id != id && 
                               b.Status == BookingStatus.Confirmed)
                    .ToListAsync();

                var hasConflict = confirmedBookings
                    .Any(b => b.EndTime > startTime && b.StartTime < endTime);

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

                // Check for conflicts with the new time - fetch and filter in memory to avoid LINQ translation issues
                var confirmedBookings = await _dbContext.Bookings
                    .Where(b => b.RoomId == booking.RoomId && 
                               b.Id != id && 
                               b.Status == BookingStatus.Confirmed)
                    .ToListAsync();

                var hasConflict = confirmedBookings
                    .Any(b => b.EndTime > dto.StartTime.Value && b.StartTime < endTime);

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

                // Check for conflicts with the new time - fetch and filter in memory to avoid LINQ translation issues
                var confirmedBookings = await _dbContext.Bookings
                    .Where(b => b.RoomId == booking.RoomId && 
                               b.Id != id && 
                               b.Status == BookingStatus.Confirmed)
                    .ToListAsync();

                var hasConflict = confirmedBookings
                    .Any(b => b.EndTime > startTime && b.StartTime < dto.EndTime.Value);

                if (hasConflict)
                {
                    return Conflict(new { Message = "Room is not available during the new requested time." });
                }

                booking.EndTime = dto.EndTime.Value;
            }

            // Update status if provided
            if (!string.IsNullOrWhiteSpace(dto.Status))
            {
                if (Enum.TryParse<BookingStatus>(dto.Status, true, out var newStatus))
                {
                    booking.Status = newStatus;
                    
                    // Set CancelledAt timestamp if status is changed to Cancelled
                    if (newStatus == BookingStatus.Cancelled && !booking.CancelledAt.HasValue)
                    {
                        booking.CancelledAt = DateTimeOffset.UtcNow;
                    }
                }
                else
                {
                    return BadRequest(new { Message = $"Invalid status. Valid values are: {string.Join(", ", Enum.GetNames(typeof(BookingStatus)))}" });
                }
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
        public async Task<IActionResult> UpdateBookingByDto([FromBody] UpdateBookingDTO dto)
        {
            return await UpdateBooking(dto.BookingId, dto);
        }

        /// <summary>
        /// Confirm a booking (Receptionist/Admin only)
        /// </summary>
        [HttpPatch("{id}/confirm")]
        [Authorize(Roles = "Receptionist,Admin")]
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

        /// <summary>
        /// Confirm booking using request body
        /// </summary>
        [HttpPost("confirm")]
        [Authorize(Roles = "Receptionist,Admin")]
        public async Task<IActionResult> ConfirmBookingByDto([FromBody] ConfirmBookingDTO dto)
        {
            return await ConfirmBooking(dto.BookingId);
        }

        #endregion

        #region DELETE Endpoints

        /// <summary>
        /// Cancel a booking
        /// </summary>
        [HttpDelete("{id}/cancel")]
        [HttpDelete("cancel/{id}")]
        public async Task<IActionResult> CancelBooking(int id)
        {
            var booking = await _dbContext.Bookings.FirstOrDefaultAsync(b => b.Id == id);
            if (booking == null)
            {
                return NotFound(new { Message = "Booking not found." });
            }

            if (booking.Status == BookingStatus.Cancelled)
            {
                return BadRequest(new { Message = "Booking is already cancelled." });
            }

            booking.Cancel();
            await _dbContext.SaveChangesAsync();
            return NoContent();
        }

        /// <summary>
        /// Cancel booking using request body
        /// </summary>
        [HttpDelete("cancel")]
        public async Task<IActionResult> CancelBookingByDto([FromBody] CancelBookingDTO cancelBookingDTO)
        {
            return await CancelBooking(cancelBookingDTO.BookingId);
        }

        /// <summary>
        /// Permanently delete a booking (Admin only)
        /// </summary>
        [HttpDelete("{id}")]
        [HttpDelete("delete/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteBooking(int id)
        {
            var booking = await _dbContext.Bookings.FirstOrDefaultAsync(b => b.Id == id);
            if (booking == null)
            {
                return NotFound(new { Message = $"Booking with ID {id} not found." });
            }

            _dbContext.Bookings.Remove(booking);
            await _dbContext.SaveChangesAsync();
            return NoContent();
        }

        /// <summary>
        /// Permanently delete booking using request body (Admin only)
        /// </summary>
        [HttpDelete("delete")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteBookingByDto([FromBody] DeleteBookingDTO dto)
        {
            return await DeleteBooking(dto.BookingId);
        }

        #endregion
    }
}
