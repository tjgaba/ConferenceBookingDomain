using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ConferenceBooking.API.DTO;
using ConferenceBooking.API.Auth;
using ConferenceBooking.API.Services;
using Microsoft.AspNetCore.Identity;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace API.Controllers
{
   
    [ApiController]

    // Base route for all authentication-related endpoints.

    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        // UserManager is provided by ASP.NET Core Identity.
        // It encapsulates all user-related operations such as:
        // - Finding users
        // - Verifying passwords
        // - Retrieving roles
        //
        // We NEVER access the user database directly.
        private readonly UserManager<ApplicationUser> _userManager;

        // TokenService is our own service responsible for:
        // - Creating JWT tokens
        // - Adding claims (user id, roles, etc.)
        // - Signing the token securely
        //
        // Controllers should not generate tokens themselves.
        private readonly TokenService _tokenService;

        // SessionManager handles user session tracking
        private readonly ISessionManager _sessionManager;

        // Dependencies are injected via constructor injection.
        // This keeps the controller:
        // - Testable
        // - Thin
        // - Focused on orchestration only
        public AuthController(
            UserManager<ApplicationUser> userManager,
            TokenService tokenService,
            ISessionManager sessionManager)
        {
            _userManager = userManager;
            _tokenService = tokenService;
            _sessionManager = sessionManager;
        }

        // This endpoint handles user authentication (login).
        //
        // POST /api/auth/login
        //
        // We use POST because:
        // - Credentials are being sent
 
        // - Sensitive data should not appear in URLs
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            // Ensure dto.Username is not null
            if (string.IsNullOrEmpty(dto.Username))
            {
                throw new ArgumentException("Username cannot be null or empty.");
            }

            // Ensure dto.Password is not null
            if (string.IsNullOrEmpty(dto.Password))
            {
                throw new ArgumentException("Password cannot be null or empty.");
            }

            // Attempt to find the user by username.
            // If the user does not exist, this returns null.
            var user = await _userManager.FindByNameAsync(dto.Username);

            // We intentionally combine both failure cases:
            // - User does not exist
            // - Password is incorrect
            //
            // This avoids leaking information about which part failed,
            // which is an important security practice.
            if (user == null || 
                !await _userManager.CheckPasswordAsync(user, dto.Password))
            {
                // 401 Unauthorized indicates authentication failure.
                // The client is not trusted at this point.
                return Unauthorized();
            }

            // If authentication succeeds, retrieve the user's roles.
            // These roles will later be embedded into the JWT
            // and used by the authorization system.
            var roles = await _userManager.GetRolesAsync(user);

            // Generate a JWT token containing:
            // - User identity
            // - Role claims
            // - Expiry information
            //
            // Token creation is delegated to a service
            // to keep the controller simple.
            var token = _tokenService.GenerateToken(user, roles);

            // Create a session to track this login
            var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
            var userAgent = HttpContext.Request.Headers["User-Agent"].ToString();
            var session = await _sessionManager.CreateSessionAsync(user.Id, token, ipAddress, userAgent);

            // Return the token and refresh token to the client.
            // The client is responsible for storing and sending
            // this token with future requests.
            return Ok(new 
            { 
                token,
                refreshToken = session.RefreshToken,
                expiresAt = session.ExpiresAt,
                user = new
                {
                    username = user.UserName,
                    email = user.Email,
                    roles
                }
            });
        }

        /// <summary>
        /// Logout and revoke the current session
        /// </summary>
        [HttpPost("logout")]
        [Authorize]
        public async Task<IActionResult> Logout()
        {
            var token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            
            if (!string.IsNullOrEmpty(token))
            {
                await _sessionManager.RevokeSessionAsync(token, "User logout");
            }

            return Ok(new { message = "Logged out successfully" });
        }

        /// <summary>
        /// Logout from all devices (revoke all user sessions)
        /// </summary>
        [HttpPost("logout-all")]
        [Authorize]
        public async Task<IActionResult> LogoutAll()
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            await _sessionManager.RevokeAllUserSessionsAsync(userId, "User logged out from all devices");

            return Ok(new { message = "Logged out from all devices successfully" });
        }

        /// <summary>
        /// Get all active sessions for the current user
        /// </summary>
        [HttpGet("sessions")]
        [Authorize]
        public async Task<IActionResult> GetActiveSessions()
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var sessions = await _sessionManager.GetUserActiveSessionsAsync(userId);

            return Ok(sessions.Select(s => new
            {
                s.Id,
                s.CreatedAt,
                s.ExpiresAt,
                s.LastActivityAt,
                s.IpAddress,
                s.UserAgent,
                isCurrent = s.Token == HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", "")
            }));
        }

        /// <summary>
        /// Revoke a specific session by ID
        /// </summary>
        [HttpDelete("sessions/{sessionId}")]
        [Authorize]
        public async Task<IActionResult> RevokeSession(int sessionId)
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var success = await _sessionManager.RevokeSessionByIdAsync(sessionId, userId, "Revoked by user");

            if (!success)
            {
                return NotFound(new { message = "Session not found or already revoked" });
            }

            return Ok(new { message = "Session revoked successfully" });
        }
    }
}
