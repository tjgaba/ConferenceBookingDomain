using System.ComponentModel.DataAnnotations;
using ConferenceBooking.API.Auth;

namespace ConferenceBooking.API.Entities;

/// <summary>
/// Tracks all status changes for users (audit trail)
/// </summary>
public class UserStatusHistory
{
    public int Id { get; set; }
    
    [Required]
    public string UserId { get; set; } = string.Empty;
    
    public ApplicationUser? User { get; set; }
    
    public bool OldStatus { get; set; } // Previous IsActive value
    
    public bool NewStatus { get; set; } // New IsActive value
    
    [Required]
    public string ChangedBy { get; set; } = string.Empty; // Who made the change (Admin's email/ID)
    
    [Required]
    public DateTime ChangedAt { get; set; } = DateTime.UtcNow;
    
    [MaxLength(500)]
    public string? Reason { get; set; } // Reason for the change
    
    [MaxLength(50)]
    public string Action { get; set; } = string.Empty; // "Activated", "Deactivated", "Deleted", "Reactivated"
    
    [MaxLength(100)]
    public string? IpAddress { get; set; } // IP address of who made the change
}
