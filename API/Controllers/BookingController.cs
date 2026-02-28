using System.Linq;
using System.Threading.Tasks;
using ConferenceBooking.API.Data;
using ConferenceBooking.API.DTO;
using ConferenceBooking.API.Auth;
using ConferenceBooking.API.Entities;
using ConferenceBooking.API.Models;
using ConferenceBooking.API.Constants;
using ConferenceBooking.API.Services;
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
    [Authorize(Roles = "Admin,Employee")]
    public class BookingController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger<BookingController> _logger;
        private readonly BookingRepository _bookingRepository;
        private readonly BookingValidationService _validationService;
        private readonly BookingManagementService _bookingManagementService;

        public BookingController(
            ApplicationDbContext dbContext,
            UserManager<ApplicationUser> userManager,
            ILogger<BookingController> logger,
            BookingRepository bookingRepository,
            BookingValidationService validationService,
            BookingManagementService bookingManagementService)
        {
            _dbContext = dbContext;
            _userManager = userManager;
            _logger = logger;
            _bookingRepository = bookingRepository;
            _validationService = validationService;
            _bookingManagementService = bookingManagementService;
        }

        #region GET Endpoints

        /// <summary>
        /// Get all bookings with pagination and sorting support
        /// </summary>
        /// <param name="page">Page number (default: 1)</param>
        /// <param name="pageSize">Items per page (default: 10)</param>
        /// <param name="sortBy">Field to sort by: Date, RoomName, CreatedAt (default: CreatedAt)</param>
        /// <param name="sortOrder">Sort order: asc or desc (default: desc)</param>
        [HttpGet]
        [HttpGet("all")]
        public async Task<IActionResult> GetAllBookings(
            [FromQuery] int page = PaginationConstants.DefaultPage, 
            [FromQuery] int pageSize = PaginationConstants.DefaultPageSize,
            [FromQuery] string? sortBy = null,
            [FromQuery] string sortOrder = "desc")
        {
            // Validate pagination parameters
            if (page < PaginationConstants.MinPage) page = PaginationConstants.DefaultPage;
            if (pageSize < PaginationConstants.MinPageSize) pageSize = PaginationConstants.DefaultPageSize;
            if (pageSize > PaginationConstants.MaxPageSize) pageSize = PaginationConstants.MaxPageSize;

            // Get paginated bookings from repository with sorting
            // Repository now returns DTOs directly with database-level projection
            var (totalCount, bookingDtos) = await _bookingRepository.GetAllBookingsPaginatedAsync(page, pageSize, sortBy, sortOrder);

            // Calculate total pages
            var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

            // Create paginated response
            var response = new PaginatedResponseDTO<BookingSummaryDTO>
            {
                CurrentPage = page,
                PageSize = pageSize,
                TotalRecords = totalCount,
                TotalPages = totalPages,
                SortBy = sortBy,
                SortOrder = sortOrder,
                Data = bookingDtos
            };

            return Ok(response);
        }

        /// <summary>
        /// Get booking by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetBookingById(int id)
        {
            var booking = await _dbContext.Bookings
                .Include(b => b.Room)
                .Include(b => b.User)
                .Where(b => b.Id == id)
                .Select(b => new BookingDetailDTO
                {
                    BookingId = b.Id,
                    RoomId = b.RoomId,
                    RoomName = b.Room.Name,
                    RoomNumber = b.Room.Number,
                    Location = b.Location.ToString(),
                    IsRoomActive = b.Room.IsActive,
                    RequestedBy = b.User != null ? (b.User.UserName ?? "Unknown User") : "Unknown User",
                    StartTime = b.StartTime,
                    EndTime = b.EndTime,
                    Status = b.Status.ToString(),
                    Capacity = b.Capacity,
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
        /// Get filtered bookings by room, location, date range, and/or room active status with pagination and sorting.
        /// All filtering happens at the database level for optimal performance.
        /// Examples:
        /// - GET /api/booking/filter?roomName=Room A&page=1&pageSize=10
        /// - GET /api/booking/filter?location=CapeTown&page=2&pageSize=20
        /// - GET /api/booking/filter?startDate=2026-02-01&endDate=2026-02-28&page=1&pageSize=10
        /// - GET /api/booking/filter?isActiveRoom=true&page=1&pageSize=10
        /// - GET /api/booking/filter?roomName=Room A&location=London&isActiveRoom=true&page=1&pageSize=10
        /// - GET /api/booking/filter?sortBy=RoomName&sortOrder=asc
        /// </summary>
        /// <param name="filter">Filter criteria</param>
        /// <param name="page">Page number (default: 1)</param>
        /// <param name="pageSize">Items per page (default: 10)</param>
        /// <param name="sortBy">Field to sort by: Date, RoomName, CreatedAt (default: CreatedAt)</param>
        /// <param name="sortOrder">Sort order: asc or desc (default: desc)</param>
        [HttpGet("filter")]
        public async Task<IActionResult> GetFilteredBookings(
            [FromQuery] FilterBookingsDTO filter, 
            [FromQuery] int page = PaginationConstants.DefaultPage, 
            [FromQuery] int pageSize = PaginationConstants.DefaultPageSize,
            [FromQuery] string? sortBy = null,
            [FromQuery] string sortOrder = "desc")
        {
            // Validate pagination parameters
            if (page < PaginationConstants.MinPage) page = PaginationConstants.DefaultPage;
            if (pageSize < PaginationConstants.MinPageSize) pageSize = PaginationConstants.DefaultPageSize;
            if (pageSize > PaginationConstants.MaxPageSize) pageSize = PaginationConstants.MaxPageSize;

            _logger.LogInformation("Filtering bookings with criteria: RoomName={RoomName}, Location={Location}, StartDate={StartDate}, EndDate={EndDate}, IsActiveRoom={IsActiveRoom}, Status={Status}, Page={Page}, PageSize={PageSize}, SortBy={SortBy}, SortOrder={SortOrder}",
                filter.RoomName, filter.Location, filter.StartDate, filter.EndDate, filter.IsActiveRoom, filter.Status, page, pageSize, sortBy, sortOrder);

            // Get paginated filtered bookings from repository with sorting
            // Repository now returns DTOs directly with database-level projection
            var (totalCount, bookingDtos) = await _bookingRepository.GetFilteredBookingsPaginatedAsync(filter, page, pageSize, sortBy, sortOrder);

            _logger.LogInformation("Found {TotalCount} bookings matching the filter criteria, returning page {Page} of {TotalPages}", 
                totalCount, page, (int)Math.Ceiling(totalCount / (double)pageSize));

            // Calculate total pages
            var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

            // Create paginated response
            var response = new PaginatedResponseDTO<BookingSummaryDTO>
            {
                CurrentPage = page,
                PageSize = pageSize,
                TotalRecords = totalCount,
                TotalPages = totalPages,
                SortBy = sortBy,
                SortOrder = sortOrder,
                Data = bookingDtos
            };

            return Ok(response);
        }

        #endregion

        #region Sorting Options

        /// <summary>
        /// Get available sorting options for bookings
        /// </summary>
        /// <returns>Available sorting fields and orders</returns>
        [HttpGet("sorting-options")]
        [AllowAnonymous]
        public IActionResult GetSortingOptions()
        {
            var options = new SortingOptionsDTO
            {
                DefaultField = "CreatedAt",
                DefaultOrder = "desc",
                AvailableFields = new List<SortFieldDTO>
                {
                    new SortFieldDTO
                    {
                        Value = "Date",
                        Description = "Sort by booking creation order (SQLite limitation: cannot sort by actual start date)"
                    },
                    new SortFieldDTO
                    {
                        Value = "RoomName",
                        Description = "Sort by room name alphabetically"
                    },
                    new SortFieldDTO
                    {
                        Value = "CreatedAt",
                        Description = "Sort by when the booking was created"
                    }
                },
                AvailableOrders = new List<SortOrderDTO>
                {
                    new SortOrderDTO
                    {
                        Value = "asc",
                        Description = "Ascending order (A to Z, oldest to newest)"
                    },
                    new SortOrderDTO
                    {
                        Value = "desc",
                        Description = "Descending order (Z to A, newest to oldest)"
                    }
                }
            };

            return Ok(options);
        }

        #endregion

        #region POST Endpoints

        /// <summary>
        /// Create a new booking - Admin only
        /// </summary>
        [Authorize(Roles = "Admin")]
        [HttpPost]
        [HttpPost("book")]
        public async Task<IActionResult> CreateBooking([FromBody] CreateBookingRequestDTO dto)
        {
            _logger.LogInformation("CreateBooking endpoint hit");

            var userValidation = await _bookingManagementService.ValidateCurrentUserAsync(User.Identity?.Name);
            if (!userValidation.isValid)
            {
                _logger.LogWarning("User validation failed: {ErrorMessage}", userValidation.errorMessage);
                return userValidation.errorMessage == "User account is inactive" ? Forbid() : Unauthorized();
            }

            var user = userValidation.user!;

            var locationValidation = _bookingManagementService.ValidateLocation(dto.Location);
            if (!locationValidation.isValid)
            {
                // Req 1: Return a proper ValidationProblemDetails so the React form can
                // map errors directly to the field that caused the failure.
                var locationProblem = new ValidationProblemDetails();
                locationProblem.Errors["Location"] = new[] { locationValidation.errorMessage! };
                return BadRequest(locationProblem);
            }

            var location = locationValidation.location!.Value;

            // ============================================================
            // DOMAIN RULE ENFORCEMENT (Service Layer)
            // All business logic validations are delegated to the service
            // ============================================================
            var validation = await _validationService.ValidateBookingCreationAsync(
                dto.RoomId,
                dto.StartDate,
                dto.EndDate,
                dto.Capacity);

            if (!validation.isValid)
            {
                _logger.LogWarning("Booking validation failed: [{Field}] {ErrorMessage}",
                    validation.fieldName, validation.errorMessage);

                // Req 1: Use ValidationProblemDetails so the response has a proper
                // { errors: { "FieldName": ["message"] } } shape the React form can parse.
                var problem = new ValidationProblemDetails();
                var fieldKey = validation.fieldName ?? "General";
                problem.Errors[fieldKey] = new[] { validation.errorMessage! };
                return BadRequest(problem);
            }

            var room = validation.room!;

            // Create booking with auto-generated ID
            // Convert to UTC before saving - PostgreSQL timestamp with time zone requires UTC (offset=0)
            var booking = new Booking
            {
                RoomId = room.Id,
                UserId = user.Id,
                StartTime = dto.StartDate.ToUniversalTime(),
                EndTime = dto.EndDate.ToUniversalTime(),
                Status = BookingStatus.Pending,
                Location = location,
                Capacity = dto.Capacity,
                CreatedAt = DateTimeOffset.UtcNow
            };

            await _dbContext.Bookings.AddAsync(booking);
            await _dbContext.SaveChangesAsync();
            
            // Reload the booking with navigation properties
            await _dbContext.Entry(booking).Reference(b => b.Room).LoadAsync();
            await _dbContext.Entry(booking).Reference(b => b.User).LoadAsync();

            var responseDto = _bookingManagementService.MapToDetailDto(booking);

            _logger.LogInformation("Booking created successfully with Pending status");
            return Ok(new { message = "Booking created and pending confirmation by receptionist.", booking = responseDto });
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
            var userValidation = await _bookingManagementService.ValidateCurrentUserAsync(User.Identity?.Name);
            if (!userValidation.isValid)
                return userValidation.errorMessage == "User account is inactive" ? Forbid() : Unauthorized();

            var idValidation = _bookingManagementService.ValidateIdMatch(id, dto.BookingId);
            if (!idValidation.isValid) return BadRequest(new { message = idValidation.errorMessage });

            // Find the existing booking
            var booking = await _dbContext.Bookings
                .Include(b => b.Room)
                .FirstOrDefaultAsync(b => b.Id == id);

            if (booking == null)
            {
                return NotFound(new { message = $"Booking with ID {id} not found." });
            }

            // Determine the final values after update (use new values if provided, otherwise keep existing)
            var finalRoomId = dto.RoomId ?? booking.RoomId;
            var finalStartTime = dto.StartTime ?? booking.StartTime;
            var finalEndTime = dto.EndTime ?? booking.EndTime;
            var finalCapacity = booking.Capacity; // Capacity not updated in this DTO

            // ============================================================
            // DOMAIN RULE ENFORCEMENT (Service Layer)
            // All business logic validations are delegated to the service
            // ============================================================
            var validation = await _validationService.ValidateBookingUpdateAsync(
                id,
                finalRoomId,
                finalStartTime,
                finalEndTime,
                finalCapacity);

            if (!validation.isValid)
            {
                _logger.LogWarning("Booking update validation failed: [{Field}] {ErrorMessage}",
                    validation.fieldName, validation.errorMessage);

                // Req 1: Return ValidationProblemDetails so the React form maps the
                // error to the specific field (StartTime, EndTime, RoomId, Capacity).
                var problem = new ValidationProblemDetails();
                var fieldKey = validation.fieldName ?? "General";
                problem.Errors[fieldKey] = new[] { validation.errorMessage! };
                return BadRequest(problem);
            }

            var validatedRoom = validation.room!;

            // Apply updates
            _bookingManagementService.ApplyBookingUpdates(booking, dto, validatedRoom);

            // Update status if provided
            if (!string.IsNullOrWhiteSpace(dto.Status))
            {
                var statusValidation = _bookingManagementService.ValidateBookingStatus(dto.Status);
                if (!statusValidation.isValid)
                {
                    var sp = new ValidationProblemDetails();
                    sp.Errors["Status"] = new[] { statusValidation.errorMessage! };
                    return BadRequest(sp);
                }

                if (statusValidation.status.HasValue)
                {
                    // State Control: route through domain state machine via ApplyStatusChange,
                    // which validates the transition and calls Confirm()/Cancel() on the entity.
                    var stateResult = _bookingManagementService.ApplyStatusChange(booking, statusValidation.status.Value);
                    if (!stateResult.isValid)
                    {
                        var sp = new ValidationProblemDetails();
                        sp.Errors["Status"] = new[] { stateResult.errorMessage! };
                        return BadRequest(sp);
                    }
                }
            }

            // Save changes to database
            await _dbContext.SaveChangesAsync();

            var responseDto = _bookingManagementService.MapToDetailDto(booking);

            return Ok(responseDto);
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
            var validation = await _bookingManagementService.ValidateBookingConfirmationAsync(id);
            if (!validation.isValid) 
            {
                return validation.errorMessage == "Booking not found" 
                    ? NotFound(new { message = validation.errorMessage })
                    : validation.errorMessage!.Contains("not available") 
                        ? Conflict(new { message = validation.errorMessage })
                        : BadRequest(new { message = validation.errorMessage });
            }

            var booking = validation.booking!;

            booking.Confirm();
            await _dbContext.SaveChangesAsync();
            
            var responseDto = _bookingManagementService.MapToDetailDto(booking);

            _logger.LogInformation($"Booking {id} confirmed by {User.Identity?.Name}");
            return Ok(new { message = "Booking confirmed successfully.", booking = responseDto });
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
            var validation = await _bookingManagementService.ValidateBookingCancellationAsync(id);
            if (!validation.isValid)
                return validation.errorMessage == "Booking not found" 
                    ? NotFound(new { message = validation.errorMessage })
                    : BadRequest(new { message = validation.errorMessage });

            var booking = validation.booking!;

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
                return NotFound(new { message = $"Booking with ID {id} not found." });
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
