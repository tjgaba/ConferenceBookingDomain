using System;
using System.ComponentModel.DataAnnotations;
using ConferenceBooking.API.Auth;

namespace ConferenceBooking.API.Entities
{
    /// <summary>
    /// Represents an authentication session for a user
    /// </summary>
    public class UserSession
    {
        public int Id { get; set; }

        [Required]
        public string UserId { get; set; } = string.Empty;

        public ApplicationUser? User { get; set; }

        [Required]
        public string Token { get; set; } = string.Empty;

        [Required]
        public string RefreshToken { get; set; } = string.Empty;

        [Required]
        public DateTimeOffset CreatedAt { get; set; }

        [Required]
        public DateTimeOffset ExpiresAt { get; set; }

        public DateTimeOffset? LastActivityAt { get; set; }

        public string? IpAddress { get; set; }

        public string? UserAgent { get; set; }

        public bool IsRevoked { get; set; }

        public DateTimeOffset? RevokedAt { get; set; }

        public string? RevokedReason { get; set; }

        /// <summary>
        /// Check if the session is currently active and valid
        /// </summary>
        public bool IsActive()
        {
            return !IsRevoked && ExpiresAt > DateTimeOffset.UtcNow;
        }

        /// <summary>
        /// Revoke this session
        /// </summary>
        public void Revoke(string reason = "User logout")
        {
            IsRevoked = true;
            RevokedAt = DateTimeOffset.UtcNow;
            RevokedReason = reason;
        }

        /// <summary>
        /// Update last activity timestamp
        /// </summary>
        public void UpdateActivity()
        {
            LastActivityAt = DateTimeOffset.UtcNow;
        }
    }
}
