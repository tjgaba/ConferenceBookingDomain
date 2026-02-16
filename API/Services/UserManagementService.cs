using Microsoft.AspNetCore.Identity;
using ConferenceBooking.API.Auth;
using ConferenceBooking.API.DTO;

namespace ConferenceBooking.API.Services;

public class UserManagementService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;

    public UserManagementService(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
    {
        _userManager = userManager;
        _roleManager = roleManager;
    }

    /// <summary>
    /// Validates user creation request and returns validation result
    /// </summary>
    public async Task<(bool isValid, string? errorMessage)> ValidateUserCreationAsync(CreateUserDTO request)
    {
        var existingUser = await _userManager.FindByEmailAsync(request.Email);
        if (existingUser != null)
        {
            return (false, "A user with this email already exists");
        }

        if (!await _roleManager.RoleExistsAsync(request.Role))
        {
            return (false, $"Role '{request.Role}' does not exist");
        }

        return (true, null);
    }

    /// <summary>
    /// Validates user update request
    /// </summary>
    public async Task<(bool isValid, string? errorMessage)> ValidateUserUpdateAsync(string userId, UpdateUserDTO request, bool isAdmin)
    {
        if (userId != request.UserId)
        {
            return (false, "User ID mismatch");
        }

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            return (false, "User not found");
        }

        if (!string.IsNullOrWhiteSpace(request.Email))
        {
            var existingUser = await _userManager.FindByEmailAsync(request.Email);
            if (existingUser != null && existingUser.Id != userId)
            {
                return (false, "Email already in use by another user");
            }
        }

        // Only validate role if user is admin (role updates are admin-only)
        if (!string.IsNullOrWhiteSpace(request.Role) && isAdmin)
        {
            if (!await _roleManager.RoleExistsAsync(request.Role))
            {
                return (false, $"Role '{request.Role}' does not exist");
            }
        }

        return (true, null);
    }

    /// <summary>
    /// Validates status change request
    /// </summary>
    public async Task<(bool isValid, string? errorMessage, ApplicationUser? user)> ValidateStatusChangeAsync(string userId, bool newStatus)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            return (false, "User not found", null);
        }

        if (user.IsActive == newStatus)
        {
            var status = newStatus ? "active" : "inactive";
            return (false, $"User is already {status}", null);
        }

        return (true, null, user);
    }

    /// <summary>
    /// Updates user properties from DTO
    /// </summary>
    public void ApplyUserUpdates(ApplicationUser user, UpdateUserDTO request)
    {
        if (!string.IsNullOrWhiteSpace(request.FirstName))
            user.FirstName = request.FirstName;

        if (!string.IsNullOrWhiteSpace(request.LastName))
            user.LastName = request.LastName;

        if (!string.IsNullOrWhiteSpace(request.Email))
        {
            user.Email = request.Email;
            user.UserName = request.Email;
        }

        if (request.PhoneNumber != null)
            user.PhoneNumber = request.PhoneNumber;

        if (request.Department != null)
            user.Department = request.Department;

        if (request.EmployeeNumber != null)
            user.EmployeeNumber = request.EmployeeNumber;

        if (request.PrimaryLocation.HasValue)
            user.PrimaryLocation = request.PrimaryLocation;

        if (request.PreferredLocation.HasValue)
            user.PreferredLocation = request.PreferredLocation;

        if (!string.IsNullOrWhiteSpace(request.NotificationPreferences))
            user.NotificationPreferences = request.NotificationPreferences;

        user.UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Creates ApplicationUser from DTO
    /// </summary>
    public ApplicationUser CreateUserFromDto(CreateUserDTO request)
    {
        return new ApplicationUser
        {
            UserName = request.Email,
            Email = request.Email,
            FirstName = request.FirstName,
            LastName = request.LastName,
            PhoneNumber = request.PhoneNumber,
            Department = request.Department,
            EmployeeNumber = request.EmployeeNumber,
            PrimaryLocation = request.PrimaryLocation,
            PreferredLocation = request.PreferredLocation,
            NotificationPreferences = request.NotificationPreferences,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            DateJoined = DateTime.UtcNow,
            EmailConfirmed = true
        };
    }

    /// <summary>
    /// Maps ApplicationUser to UserResponseDTO
    /// </summary>
    public async Task<UserResponseDTO> MapToResponseDto(ApplicationUser user)
    {
        var roles = await _userManager.GetRolesAsync(user);
        
        return new UserResponseDTO
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
        };
    }

    /// <summary>
    /// Validates and performs soft delete on user
    /// </summary>
    public async Task<(bool isValid, string? errorMessage, ApplicationUser? user)> ValidateAndPrepareDeleteAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            return (false, "User not found", null);
        }

        if (!user.IsActive)
        {
            return (false, "User is already inactive", null);
        }

        return (true, null, user);
    }

    /// <summary>
    /// Validates and prepares user for reactivation
    /// </summary>
    public async Task<(bool isValid, string? errorMessage, ApplicationUser? user)> ValidateAndPrepareReactivationAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            return (false, "User not found", null);
        }

        if (user.IsActive)
        {
            return (false, "User is already active", null);
        }

        return (true, null, user);
    }

    /// <summary>
    /// Applies status change to user
    /// </summary>
    public void ApplyStatusChange(ApplicationUser user, bool isActive)
    {
        user.IsActive = isActive;
        user.UpdatedAt = DateTime.UtcNow;
        user.DeletedAt = isActive ? null : DateTime.UtcNow;
    }

    /// <summary>
    /// Updates user roles (admin only operation)
    /// </summary>
    public async Task<IdentityResult> UpdateUserRoleAsync(ApplicationUser user, string newRole, bool isAdmin)
    {
        if (string.IsNullOrWhiteSpace(newRole) || !isAdmin)
        {
            return IdentityResult.Success;
        }

        if (!await _roleManager.RoleExistsAsync(newRole))
        {
            return IdentityResult.Failed(new IdentityError { Description = $"Role '{newRole}' does not exist" });
        }

        var currentRoles = await _userManager.GetRolesAsync(user);
        await _userManager.RemoveFromRolesAsync(user, currentRoles);
        return await _userManager.AddToRoleAsync(user, newRole);
    }
}
