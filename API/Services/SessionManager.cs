using System;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;
using ConferenceBooking.API.Data;
using ConferenceBooking.API.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace ConferenceBooking.API.Services
{
    public interface ISessionManager
    {
        Task<UserSession> CreateSessionAsync(string userId, string token, string? ipAddress = null, string? userAgent = null);
        Task<UserSession?> GetSessionByTokenAsync(string token);
        Task<UserSession?> GetSessionByRefreshTokenAsync(string refreshToken);
        Task<bool> ValidateSessionAsync(string token);
        Task RevokeSessionAsync(string token, string reason = "User logout");
        Task RevokeAllUserSessionsAsync(string userId, string reason = "Logout from all devices");
        Task<int> CleanupExpiredSessionsAsync();
        Task UpdateSessionActivityAsync(string token);
        Task<List<UserSession>> GetUserActiveSessionsAsync(string userId);
        Task<bool> RevokeSessionByIdAsync(int sessionId, string userId, string reason);
    }

    public class SessionManager : ISessionManager
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public SessionManager(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        /// <summary>
        /// Create a new user session
        /// </summary>
        public async Task<UserSession> CreateSessionAsync(string userId, string token, string? ipAddress = null, string? userAgent = null)
        {
            var tokenExpirationHours = _configuration.GetValue<int>("Jwt:ExpirationHours", 24);
            var refreshToken = GenerateRefreshToken();

            var session = new UserSession
            {
                UserId = userId,
                Token = token,
                RefreshToken = refreshToken,
                CreatedAt = DateTimeOffset.UtcNow,
                ExpiresAt = DateTimeOffset.UtcNow.AddHours(tokenExpirationHours),
                LastActivityAt = DateTimeOffset.UtcNow,
                IpAddress = ipAddress,
                UserAgent = userAgent,
                IsRevoked = false
            };

            _context.UserSessions.Add(session);
            await _context.SaveChangesAsync();

            return session;
        }

        /// <summary>
        /// Get session by JWT token
        /// </summary>
        public async Task<UserSession?> GetSessionByTokenAsync(string token)
        {
            return await _context.UserSessions
                .Include(s => s.User)
                .FirstOrDefaultAsync(s => s.Token == token);
        }

        /// <summary>
        /// Get session by refresh token
        /// </summary>
        public async Task<UserSession?> GetSessionByRefreshTokenAsync(string refreshToken)
        {
            return await _context.UserSessions
                .Include(s => s.User)
                .FirstOrDefaultAsync(s => s.RefreshToken == refreshToken);
        }

        /// <summary>
        /// Validate if a session is active and not expired
        /// </summary>
        public async Task<bool> ValidateSessionAsync(string token)
        {
            var session = await GetSessionByTokenAsync(token);
            return session != null && session.IsActive();
        }

        /// <summary>
        /// Revoke a specific session
        /// </summary>
        public async Task RevokeSessionAsync(string token, string reason = "User logout")
        {
            var session = await GetSessionByTokenAsync(token);
            if (session != null && !session.IsRevoked)
            {
                session.Revoke(reason);
                await _context.SaveChangesAsync();
            }
        }

        /// <summary>
        /// Revoke all sessions for a specific user
        /// </summary>
        public async Task RevokeAllUserSessionsAsync(string userId, string reason = "Logout from all devices")
        {
            var now = DateTimeOffset.UtcNow;
            var sessions = await _context.UserSessions
                .Where(s => s.UserId == userId && !s.IsRevoked)
                .ToListAsync();

            var activeSessions = sessions.Where(s => s.ExpiresAt > now).ToList();
            
            foreach (var session in activeSessions)
            {
                session.Revoke(reason);
            }

            await _context.SaveChangesAsync();
        }

        /// <summary>
        /// Clean up expired and revoked sessions (maintenance task)
        /// </summary>
        public async Task<int> CleanupExpiredSessionsAsync()
        {
            var now = DateTimeOffset.UtcNow;
            var cutoffDate = now.AddDays(-30); // Keep sessions for 30 days for audit purposes
            
            var allSessions = await _context.UserSessions
                .Where(s => s.CreatedAt < cutoffDate)
                .ToListAsync();
            
            var expiredSessions = allSessions
                .Where(s => s.ExpiresAt < now || s.IsRevoked)
                .ToList();

            _context.UserSessions.RemoveRange(expiredSessions);
            await _context.SaveChangesAsync();

            return expiredSessions.Count;
        }

        /// <summary>
        /// Update last activity timestamp for a session
        /// </summary>
        public async Task UpdateSessionActivityAsync(string token)
        {
            var session = await GetSessionByTokenAsync(token);
            if (session != null && session.IsActive())
            {
                session.UpdateActivity();
                await _context.SaveChangesAsync();
            }
        }

        /// <summary>
        /// Get all active sessions for a specific user
        /// </summary>
        public async Task<List<UserSession>> GetUserActiveSessionsAsync(string userId)
        {
            var now = DateTimeOffset.UtcNow;
            var userSessions = await _context.UserSessions
                .Where(s => s.UserId == userId && !s.IsRevoked)
                .ToListAsync();
            
            return userSessions
                .Where(s => s.ExpiresAt > now)
                .OrderByDescending(s => s.LastActivityAt ?? s.CreatedAt)
                .ToList();
        }

        /// <summary>
        /// Revoke a specific session by ID (only if it belongs to the user)
        /// </summary>
        public async Task<bool> RevokeSessionByIdAsync(int sessionId, string userId, string reason)
        {
            var session = await _context.UserSessions
                .FirstOrDefaultAsync(s => s.Id == sessionId && s.UserId == userId);

            if (session == null || session.IsRevoked)
            {
                return false;
            }

            session.Revoke(reason);
            await _context.SaveChangesAsync();
            return true;
        }

        /// <summary>
        /// Generate a cryptographically secure refresh token
        /// </summary>
        private string GenerateRefreshToken()
        {
            var randomBytes = new byte[64];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomBytes);
            }
            return Convert.ToBase64String(randomBytes);
        }
    }
}
