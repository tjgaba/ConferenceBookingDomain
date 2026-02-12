using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ConferenceBooking.API.Auth;
using ConferenceBooking.API.Models;
using ConferenceBooking.API.Entities;

public class ApplicationDbContext : IdentityDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            optionsBuilder.UseSqlite("Data Source=conference_booking.db");
        }
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure Booking-Room relationship
        modelBuilder.Entity<Booking>()
            .HasOne(b => b.Room)
            .WithMany()
            .HasForeignKey(b => b.RoomId)
            .OnDelete(DeleteBehavior.Restrict);

        // Configure Booking timestamps
        modelBuilder.Entity<Booking>()
            .Property(b => b.CreatedAt)
            .IsRequired()
            .HasDefaultValueSql("datetime('now')");

        modelBuilder.Entity<Booking>()
            .Property(b => b.CancelledAt)
            .IsRequired(false);

        // Configure ConferenceSession-Room relationship
        modelBuilder.Entity<ConferenceSession>()
            .HasOne(s => s.Room)
            .WithMany()
            .HasForeignKey(s => s.RoomId)
            .OnDelete(DeleteBehavior.SetNull);

        // Configure UserSession-User relationship
        modelBuilder.Entity<UserSession>()
            .HasOne(s => s.User)
            .WithMany()
            .HasForeignKey(s => s.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // Configure UserSession indexes for performance
        modelBuilder.Entity<UserSession>()
            .HasIndex(s => s.Token);
        
        modelBuilder.Entity<UserSession>()
            .HasIndex(s => s.RefreshToken);
        
        modelBuilder.Entity<UserSession>()
            .HasIndex(s => new { s.UserId, s.IsRevoked, s.ExpiresAt });

        // Seed Conference Rooms - Each location has standardized room set
        modelBuilder.Entity<ConferenceRoom>().HasData(
            // London rooms
            new ConferenceRoom { Id = 1, Name = "Conference Room A", Capacity = 10, Number = 101, Location = RoomLocation.London, IsActive = true },
            new ConferenceRoom { Id = 2, Name = "Conference Room B", Capacity = 8, Number = 102, Location = RoomLocation.London, IsActive = true },
            new ConferenceRoom { Id = 3, Name = "Conference Room C", Capacity = 15, Number = 103, Location = RoomLocation.London, IsActive = true },
            new ConferenceRoom { Id = 4, Name = "Board Room", Capacity = 20, Number = 104, Location = RoomLocation.London, IsActive = true },
            new ConferenceRoom { Id = 5, Name = "Meeting Room 1", Capacity = 6, Number = 105, Location = RoomLocation.London, IsActive = true },
            
            // Cape Town rooms
            new ConferenceRoom { Id = 6, Name = "Conference Room A", Capacity = 10, Number = 201, Location = RoomLocation.CapeTown, IsActive = true },
            new ConferenceRoom { Id = 7, Name = "Conference Room B", Capacity = 8, Number = 202, Location = RoomLocation.CapeTown, IsActive = true },
            new ConferenceRoom { Id = 8, Name = "Conference Room C", Capacity = 15, Number = 203, Location = RoomLocation.CapeTown, IsActive = true },
            new ConferenceRoom { Id = 9, Name = "Board Room", Capacity = 20, Number = 204, Location = RoomLocation.CapeTown, IsActive = true },
            new ConferenceRoom { Id = 10, Name = "Meeting Room 1", Capacity = 6, Number = 205, Location = RoomLocation.CapeTown, IsActive = true },
            
            // Johannesburg rooms
            new ConferenceRoom { Id = 11, Name = "Conference Room A", Capacity = 10, Number = 301, Location = RoomLocation.Johannesburg, IsActive = true },
            new ConferenceRoom { Id = 12, Name = "Conference Room B", Capacity = 8, Number = 302, Location = RoomLocation.Johannesburg, IsActive = true },
            new ConferenceRoom { Id = 13, Name = "Conference Room C", Capacity = 15, Number = 303, Location = RoomLocation.Johannesburg, IsActive = true },
            new ConferenceRoom { Id = 14, Name = "Board Room", Capacity = 20, Number = 304, Location = RoomLocation.Johannesburg, IsActive = true },
            new ConferenceRoom { Id = 15, Name = "Meeting Room 1", Capacity = 6, Number = 305, Location = RoomLocation.Johannesburg, IsActive = true },
            
            // Bloemfontein rooms
            new ConferenceRoom { Id = 16, Name = "Conference Room A", Capacity = 10, Number = 401, Location = RoomLocation.Bloemfontein, IsActive = true },
            new ConferenceRoom { Id = 17, Name = "Conference Room B", Capacity = 8, Number = 402, Location = RoomLocation.Bloemfontein, IsActive = true },
            new ConferenceRoom { Id = 18, Name = "Conference Room C", Capacity = 15, Number = 403, Location = RoomLocation.Bloemfontein, IsActive = true },
            new ConferenceRoom { Id = 19, Name = "Board Room", Capacity = 20, Number = 404, Location = RoomLocation.Bloemfontein, IsActive = true },
            new ConferenceRoom { Id = 20, Name = "Meeting Room 1", Capacity = 6, Number = 405, Location = RoomLocation.Bloemfontein, IsActive = true },
            
            // Durban rooms
            new ConferenceRoom { Id = 21, Name = "Conference Room A", Capacity = 10, Number = 501, Location = RoomLocation.Durban, IsActive = true },
            new ConferenceRoom { Id = 22, Name = "Conference Room B", Capacity = 8, Number = 502, Location = RoomLocation.Durban, IsActive = true },
            new ConferenceRoom { Id = 23, Name = "Conference Room C", Capacity = 15, Number = 503, Location = RoomLocation.Durban, IsActive = true },
            new ConferenceRoom { Id = 24, Name = "Board Room", Capacity = 20, Number = 504, Location = RoomLocation.Durban, IsActive = true },
            new ConferenceRoom { Id = 25, Name = "Meeting Room 1", Capacity = 6, Number = 505, Location = RoomLocation.Durban, IsActive = true },
            
            // REQUIREMENT: At least one inactive room (soft-deleted/deactivated)
            // Room 26 is marked as inactive for testing deactivation functionality
            new ConferenceRoom { Id = 26, Name = "Archived Meeting Room", Capacity = 12, Number = 506, Location = RoomLocation.Durban, IsActive = false }
        );

        // REQUIREMENT: At least one session with a valid time range
        // Session must have StartTime < EndTime to be valid
        // This seeds a test session for Room 6 (Cape Town Conference Room A)
        // Using high ID (9001) to avoid conflicts with user-created sessions
        modelBuilder.Entity<ConferenceSession>().HasData(
            new ConferenceSession 
            { 
                Id = 9001, // High ID to avoid conflicts - makes seeding repeatable
                Title = "Q1 Strategy Planning Session", // Required field
                Description = "Quarterly strategic planning and review meeting", // Optional description
                RoomId = 6, // Cape Town Conference Room A
                Capacity = 10, 
                StartTime = new DateTimeOffset(2026, 3, 1, 9, 0, 0, TimeSpan.Zero), // March 1, 2026 9:00 AM UTC
                EndTime = new DateTimeOffset(2026, 3, 1, 11, 0, 0, TimeSpan.Zero)   // March 1, 2026 11:00 AM UTC
            }
        );

        // REQUIREMENT: At least one booking in a non-default status
        // Default status is "Pending", so we need a Confirmed or Cancelled booking
        // This seeds a confirmed booking for testing the booking lifecycle
        // Using high ID (9001) to avoid conflicts with user-created bookings - ensures repeatability
        modelBuilder.Entity<Booking>().HasData(
            new Booking 
            { 
                Id = 9001, // High ID to avoid conflicts - makes seeding repeatable without duplicates
                RoomId = 6, // Cape Town Conference Room A (same room as session above)
                RequestedBy = "seed.user@test.com", // Test user who created the booking
                StartTime = new DateTimeOffset(2026, 2, 15, 14, 0, 0, TimeSpan.Zero), // Feb 15, 2026 2:00 PM UTC
                EndTime = new DateTimeOffset(2026, 2, 15, 16, 0, 0, TimeSpan.Zero),   // Feb 15, 2026 4:00 PM UTC
                Status = BookingStatus.Confirmed, // NON-DEFAULT STATUS (default would be Pending)
                CreatedAt = new DateTimeOffset(2026, 2, 10, 10, 0, 0, TimeSpan.Zero), // When booking was created
                CancelledAt = null, // Not cancelled
                Location = RoomLocation.CapeTown, // Booking location matches room location
                Capacity = 10 // Required capacity for this booking
            }
        );
    }

    public DbSet<ApplicationUser> ApplicationUsers { get; set; }
    public DbSet<Booking> Bookings { get; set; }
    public DbSet<ConferenceRoom> ConferenceRooms { get; set; }
    public DbSet<ConferenceSession> ConferenceSessions { get; set; }
    public DbSet<UserSession> UserSessions { get; set; }
}