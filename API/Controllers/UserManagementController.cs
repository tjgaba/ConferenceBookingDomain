using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ConferenceBooking.API.Auth;
using ConferenceBooking.API.Constants;
using ConferenceBooking.API.Data;
using ConferenceBooking.API.DTO;
using ConferenceBooking.API.Entities;
using ConferenceBooking.API.Services;

namespace ConferenceBooking.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize] // Require authentication for all endpoints
public class UserManagementController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly ILogger<UserManagementController> _logger;
    private readonly ApplicationDbContext _context;
    private readonly UserManagementService _userManagementService;

    public UserManagementController(
        UserManager<ApplicationUser> userManager,
        RoleManager<IdentityRole> roleManager,
        ILogger<UserManagementController> logger,
        ApplicationDbContext context,
        UserManagementService userManagementService)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _logger = logger;
        _context = context;
        _userManagementService = userManagementService;
    }

    /// <summary>
    /// Helper method to log status changes to history
    /// </summary>
    private async Task LogStatusChange(string userId, bool oldStatus, bool newStatus, string action, string? reason = null)
    {
        var history = new UserStatusHistory
        {
            UserId = userId,
            OldStatus = oldStatus,
            NewStatus = newStatus,
            ChangedBy = User.Identity?.Name ?? "System",
            ChangedAt = DateTime.UtcNow,
            Reason = reason,
            Action = action,
            IpAddress = HttpContext.Connection.RemoteIpAddress?.ToString()
        };

        _context.UserStatusHistories.Add(history);
        await _context.SaveChangesAsync();
    }

    /// <summary>
    /// Get all users with optional filtering
    /// By default, only active users are returned to prevent showing soft-deleted users
    /// </summary>
    [HttpGet("fetch")]
    [Authorize(Roles = "Admin,FacilityManager")]
    public async Task<ActionResult<PaginatedResponseDTO<UserResponseDTO>>> GetAllUsers([FromQuery] GetAllUsersDTO request)
    {
        try
        {
            // Start with all users
            var query = _userManager.Users.AsQueryable();

            // Apply IsActive filter - defaults to true (active only) if not explicitly specified
            if (request.IsActive.HasValue)
            {
                query = query.Where(u => u.IsActive == request.IsActive.Value);
            }
            else
            {
                // Default: only show active users in normal endpoint
                query = query.Where(u => u.IsActive == true);
            }

            // Apply Department filter
            if (!string.IsNullOrWhiteSpace(request.Department))
            {
                query = query.Where(u => u.Department == request.Department);
            }

            // Get total count
            var totalCount = await query.CountAsync();

            // Apply pagination
            var users = await query
                .OrderBy(u => u.LastName)
                .ThenBy(u => u.FirstName)
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync();

            // Map to DTOs and include roles
            var userDtos = new List<UserResponseDTO>();
            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                
                // Apply role filter if specified
                if (!string.IsNullOrWhiteSpace(request.Role) && !roles.Contains(request.Role))
                {
                    continue;
                }

                userDtos.Add(new UserResponseDTO
                {
                    Id = user.Id,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    FullName = user.FullName,
                    Email = user.Email ?? string.Empty,
                    PhoneNumber = user.PhoneNumber,
                    Department = user.Department,
                    EmployeeNumber = user.EmployeeNumber,
                    PrimaryLocation = user.PrimaryLocation,
                    PreferredLocation = user.PreferredLocation,
                    NotificationPreferences = user.NotificationPreferences,
                    IsActive = user.IsActive,
                    Roles = roles.ToList(),
                    DateJoined = user.DateJoined,
                    LastLoginDate = user.LastLoginDate,
                    CreatedAt = user.CreatedAt,
                    UpdatedAt = user.UpdatedAt,
                    DeletedAt = user.DeletedAt
                });
            }

            var response = new PaginatedResponseDTO<UserResponseDTO>
            {
                Data = userDtos,
                CurrentPage = request.PageNumber,
                PageSize = request.PageSize,
                TotalRecords = totalCount,
                TotalPages = (int)Math.Ceiling(totalCount / (double)request.PageSize)
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving users");
            return StatusCode(500, new { message = "An error occurred while retrieving users" });
        }
    }

    /// <summary>
    /// Get all active users (IsActive = true)
    /// </summary>
    [HttpGet("fetch/true")]
    [Authorize(Roles = "Admin,FacilityManager")]
    public async Task<ActionResult<PaginatedResponseDTO<UserResponseDTO>>> GetActiveUsers([FromQuery] int pageNumber = PaginationConstants.DefaultPage, [FromQuery] int pageSize = PaginationConstants.DefaultPageSize)
    {
        try
        {
            // Get only active users
            var query = _userManager.Users.Where(u => u.IsActive == true);

            var totalCount = await query.CountAsync();

            var users = await query
                .OrderBy(u => u.LastName)
                .ThenBy(u => u.FirstName)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var userDtos = new List<UserResponseDTO>();
            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);

                userDtos.Add(new UserResponseDTO
                {
                    Id = user.Id,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    FullName = user.FullName,
                    Email = user.Email ?? string.Empty,
                    PhoneNumber = user.PhoneNumber,
                    Department = user.Department,
                    EmployeeNumber = user.EmployeeNumber,
                    PrimaryLocation = user.PrimaryLocation,
                    PreferredLocation = user.PreferredLocation,
                    NotificationPreferences = user.NotificationPreferences,
                    IsActive = user.IsActive,
                    Roles = roles.ToList(),
                    DateJoined = user.DateJoined,
                    LastLoginDate = user.LastLoginDate,
                    CreatedAt = user.CreatedAt,
                    UpdatedAt = user.UpdatedAt,
                    DeletedAt = user.DeletedAt
                });
            }

            var response = new PaginatedResponseDTO<UserResponseDTO>
            {
                Data = userDtos,
                CurrentPage = pageNumber,
                PageSize = pageSize,
                TotalRecords = totalCount,
                TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving active users");
            return StatusCode(500, new { message = "An error occurred while retrieving active users" });
        }
    }

    /// <summary>
    /// Get all inactive users (IsActive = false)
    /// </summary>
    [HttpGet("fetch/false")]
    [Authorize(Roles = "Admin,FacilityManager")]
    public async Task<ActionResult<PaginatedResponseDTO<UserResponseDTO>>> GetInactiveUsers([FromQuery] int pageNumber = PaginationConstants.DefaultPage, [FromQuery] int pageSize = PaginationConstants.DefaultPageSize)
    {
        try
        {
            // Get only inactive users
            var query = _userManager.Users.Where(u => u.IsActive == false);

            var totalCount = await query.CountAsync();

            var users = await query
                .OrderBy(u => u.LastName)
                .ThenBy(u => u.FirstName)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var userDtos = new List<UserResponseDTO>();
            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);

                userDtos.Add(new UserResponseDTO
                {
                    Id = user.Id,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    FullName = user.FullName,
                    Email = user.Email ?? string.Empty,
                    PhoneNumber = user.PhoneNumber,
                    Department = user.Department,
                    EmployeeNumber = user.EmployeeNumber,
                    PrimaryLocation = user.PrimaryLocation,
                    PreferredLocation = user.PreferredLocation,
                    NotificationPreferences = user.NotificationPreferences,
                    IsActive = user.IsActive,
                    Roles = roles.ToList(),
                    DateJoined = user.DateJoined,
                    LastLoginDate = user.LastLoginDate,
                    CreatedAt = user.CreatedAt,
                    UpdatedAt = user.UpdatedAt,
                    DeletedAt = user.DeletedAt
                });
            }

            var response = new PaginatedResponseDTO<UserResponseDTO>
            {
                Data = userDtos,
                CurrentPage = pageNumber,
                PageSize = pageSize,
                TotalRecords = totalCount,
                TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving inactive users");
            return StatusCode(500, new { message = "An error occurred while retrieving inactive users" });
        }
    }

    /// <summary>
    /// Get a specific user by ID
    /// </summary>
    [HttpGet("{userId}")]
    [Authorize(Roles = "Admin,FacilityManager,Receptionist")]
    public async Task<ActionResult<UserResponseDTO>> GetUser(string userId)
    {
        try
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return NotFound(new { message = "User not found" });

            var userDto = await _userManagementService.MapToResponseDto(user);
            return Ok(userDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving user {UserId}", userId);
            return StatusCode(500, new { message = "An error occurred while retrieving the user" });
        }
    }

    /// <summary>
    /// Create a new user
    /// </summary>
    [HttpPost("create")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<UserResponseDTO>> CreateUser([FromBody] CreateUserDTO request)
    {
        try
        {
            // Validate request using service
            var validation = await _userManagementService.ValidateUserCreationAsync(request);
            if (!validation.isValid)
            {
                return BadRequest(new { message = validation.errorMessage });
            }

            // Create user using service
            var user = _userManagementService.CreateUserFromDto(request);

            var result = await _userManager.CreateAsync(user, request.Password);
            if (!result.Succeeded)
            {
                return BadRequest(new { message = "Failed to create user", errors = result.Errors });
            }

            await _userManager.AddToRoleAsync(user, request.Role);
            _logger.LogInformation("User {Email} created successfully by {Admin}", request.Email, User.Identity?.Name);

            // Map to DTO using service
            var userDto = await _userManagementService.MapToResponseDto(user);

            return CreatedAtAction(nameof(GetUser), new { userId = user.Id }, userDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating user");
            return StatusCode(500, new { message = "An error occurred while creating the user" });
        }
    }

    /// <summary>
    /// Update an existing user
    /// </summary>
    [HttpPut("{userId}/update")]
    [Authorize(Roles = "Admin,FacilityManager")]
    public async Task<ActionResult<UserResponseDTO>> UpdateUser(string userId, [FromBody] UpdateUserDTO request)
    {
        try
        {
            var validation = await _userManagementService.ValidateUserUpdateAsync(userId, request, User.IsInRole("Admin"));
            if (!validation.isValid) return BadRequest(new { message = validation.errorMessage });

            var user = await _userManager.FindByIdAsync(userId);
            _userManagementService.ApplyUserUpdates(user!, request);

            var result = await _userManager.UpdateAsync(user!);
            if (!result.Succeeded) return BadRequest(new { message = "Failed to update user", errors = result.Errors });

            var roleResult = await _userManagementService.UpdateUserRoleAsync(user!, request.Role!, User.IsInRole("Admin"));
            if (!roleResult.Succeeded) return BadRequest(new { message = "Failed to update role", errors = roleResult.Errors });

            _logger.LogInformation("User {UserId} updated successfully by {Admin}", userId, User.Identity?.Name);

            var userDto = await _userManagementService.MapToResponseDto(user!);
            return Ok(userDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating user {UserId}", userId);
            return StatusCode(500, new { message = "An error occurred while updating the user" });
        }
    }

    /// <summary>
    /// Soft delete a user (marks as inactive)
    /// </summary>
    [HttpDelete("{userId}/deactivate")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> DeleteUser(string userId, [FromBody] DeleteUserDTO? request = null)
    {
        try
        {
            var validation = await _userManagementService.ValidateAndPrepareDeleteAsync(userId);
            if (!validation.isValid) return BadRequest(new { message = validation.errorMessage });

            var user = validation.user!;
            _userManagementService.ApplyStatusChange(user, false);

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded) return BadRequest(new { message = "Failed to deactivate user", errors = result.Errors });

            await LogStatusChange(userId, true, false, "Soft Deleted", request?.Reason);
            _logger.LogInformation(
                "User {UserId} ({Email}) soft deleted by {Admin}. Reason: {Reason}",
                userId, user.Email, User.Identity?.Name, request?.Reason ?? "Not specified"
            );

            return Ok(new { message = "User deactivated successfully", deletedAt = user.DeletedAt });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting user {UserId}", userId);
            return StatusCode(500, new { message = "An error occurred while deleting the user" });
        }
    }

    /// <summary>
    /// Reactivate a soft-deleted user
    /// </summary>
    [HttpPost("{userId}/reactivate")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<UserResponseDTO>> ReactivateUser(string userId)
    {
        try
        {
            var validation = await _userManagementService.ValidateAndPrepareReactivationAsync(userId);
            if (!validation.isValid) return BadRequest(new { message = validation.errorMessage });

            var user = validation.user!;
            _userManagementService.ApplyStatusChange(user, true);

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded) return BadRequest(new { message = "Failed to reactivate user", errors = result.Errors });

            await LogStatusChange(userId, false, true, "Reactivated", "User reactivated");
            _logger.LogInformation("User {UserId} ({Email}) reactivated by {Admin}", userId, user.Email, User.Identity?.Name);

            var userDto = await _userManagementService.MapToResponseDto(user);
            return Ok(userDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error reactivating user {UserId}", userId);
            return StatusCode(500, new { message = "An error occurred while reactivating the user" });
        }
    }

    /// <summary>
    /// Change user's active status (activate or deactivate)
    /// </summary>
    [HttpPatch("{userId}/status")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<UserResponseDTO>> ChangeUserStatus(string userId, [FromBody] ChangeUserStatusDTO request)
    {
        try
        {
            var validation = await _userManagementService.ValidateStatusChangeAsync(userId, request.IsActive);
            if (!validation.isValid) return BadRequest(new { message = validation.errorMessage });

            var user = validation.user!;
            _userManagementService.ApplyStatusChange(user, request.IsActive);

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded) return BadRequest(new { message = "Failed to update user status", errors = result.Errors });

            var action = request.IsActive ? "Activated" : "Deactivated";
            await LogStatusChange(userId, !request.IsActive, request.IsActive, action, request.Reason);
            _logger.LogInformation(
                "User {UserId} ({Email}) {Action} by {Admin}. Reason: {Reason}",
                userId, user.Email, action.ToLower(), User.Identity?.Name, request.Reason ?? "Not specified"
            );

            var userDto = await _userManagementService.MapToResponseDto(user);
            return Ok(userDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error changing status for user {UserId}", userId);
            return StatusCode(500, new { message = "An error occurred while changing the user status" });
        }
    }

    /// <summary>
    /// Get status change history for a specific user
    /// </summary>
    [HttpGet("{userId}/history")]
    [Authorize(Roles = "Admin,FacilityManager")]
    public async Task<ActionResult<List<UserStatusHistoryDTO>>> GetUserStatusHistory(string userId)
    {
        try
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            var history = await _context.UserStatusHistories
                .Where(h => h.UserId == userId)
                .OrderByDescending(h => h.ChangedAt)
                .Select(h => new UserStatusHistoryDTO
                {
                    Id = h.Id,
                    UserId = h.UserId,
                    UserFullName = user.FullName,
                    OldStatus = h.OldStatus,
                    NewStatus = h.NewStatus,
                    ChangedBy = h.ChangedBy,
                    ChangedAt = h.ChangedAt,
                    Reason = h.Reason,
                    Action = h.Action,
                    IpAddress = h.IpAddress
                })
                .ToListAsync();

            return Ok(history);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving status history for user {UserId}", userId);
            return StatusCode(500, new { message = "An error occurred while retrieving status history" });
        }
    }

    /// <summary>
    /// Get all status changes across all users
    /// </summary>
    [HttpGet("history/all")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<List<UserStatusHistoryDTO>>> GetAllStatusHistory([FromQuery] int pageNumber = PaginationConstants.DefaultPage, [FromQuery] int pageSize = PaginationConstants.DefaultPageSize)
    {
        try
        {
            var totalCount = await _context.UserStatusHistories.CountAsync();

            var history = await _context.UserStatusHistories
                .Include(h => h.User)
                .OrderByDescending(h => h.ChangedAt)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(h => new UserStatusHistoryDTO
                {
                    Id = h.Id,
                    UserId = h.UserId,
                    UserFullName = h.User != null ? h.User.FullName : "Unknown",
                    OldStatus = h.OldStatus,
                    NewStatus = h.NewStatus,
                    ChangedBy = h.ChangedBy,
                    ChangedAt = h.ChangedAt,
                    Reason = h.Reason,
                    Action = h.Action,
                    IpAddress = h.IpAddress
                })
                .ToListAsync();

            return Ok(new 
            { 
                data = history, 
                totalCount = totalCount,
                currentPage = pageNumber,
                pageSize = pageSize,
                totalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving all status history");
            return StatusCode(500, new { message = "An error occurred while retrieving status history" });
        }
    }
}
