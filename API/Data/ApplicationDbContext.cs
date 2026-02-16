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

        // Configure Booking-User relationship
        modelBuilder.Entity<Booking>()
            .HasOne(b => b.User)
            .WithMany(u => u.Bookings)
            .HasForeignKey(b => b.UserId)
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

        // Configure ApplicationUser properties
        modelBuilder.Entity<ApplicationUser>()
            .Property(u => u.CreatedAt)
            .IsRequired();

        modelBuilder.Entity<ApplicationUser>()
            .Property(u => u.DateJoined)
            .IsRequired();

        modelBuilder.Entity<ApplicationUser>()
            .Property(u => u.IsActive)
            .IsRequired()
            .HasDefaultValue(true);

        // Index on EmployeeNumber for quick lookups
        modelBuilder.Entity<ApplicationUser>()
            .HasIndex(u => u.EmployeeNumber)
            .IsUnique()
            .HasFilter("EmployeeNumber IS NOT NULL");

        // Index on IsActive for filtering active/inactive users
        modelBuilder.Entity<ApplicationUser>()
            .HasIndex(u => u.IsActive);

        // Index on Department for filtering by department
        modelBuilder.Entity<ApplicationUser>()
            .HasIndex(u => u.Department);

        // Configure UserStatusHistory
        modelBuilder.Entity<UserStatusHistory>()
            .HasOne(h => h.User)
            .WithMany()
            .HasForeignKey(h => h.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<UserStatusHistory>()
            .HasIndex(h => h.UserId);

        modelBuilder.Entity<UserStatusHistory>()
            .HasIndex(h => h.ChangedAt);

        // Seed Conference Rooms - Each location has standardized room set
        modelBuilder.Entity<ConferenceRoom>().HasData(
            // London rooms
            new ConferenceRoom { Id = 1, Name = "Room A", Capacity = 10, Number = 101, Location = RoomLocation.London, IsActive = true },
            new ConferenceRoom { Id = 2, Name = "Room B", Capacity = 8, Number = 102, Location = RoomLocation.London, IsActive = true },
            new ConferenceRoom { Id = 3, Name = "Room C", Capacity = 15, Number = 103, Location = RoomLocation.London, IsActive = true },
            new ConferenceRoom { Id = 4, Name = "Room D", Capacity = 20, Number = 104, Location = RoomLocation.London, IsActive = true },
            new ConferenceRoom { Id = 5, Name = "Room E", Capacity = 6, Number = 105, Location = RoomLocation.London, IsActive = true },
            
            // Cape Town rooms
            new ConferenceRoom { Id = 6, Name = "Room A", Capacity = 10, Number = 201, Location = RoomLocation.CapeTown, IsActive = true },
            new ConferenceRoom { Id = 7, Name = "Room B", Capacity = 8, Number = 202, Location = RoomLocation.CapeTown, IsActive = true },
            new ConferenceRoom { Id = 8, Name = "Room C", Capacity = 15, Number = 203, Location = RoomLocation.CapeTown, IsActive = true },
            new ConferenceRoom { Id = 9, Name = "Room D", Capacity = 20, Number = 204, Location = RoomLocation.CapeTown, IsActive = true },
            new ConferenceRoom { Id = 10, Name = "Room E", Capacity = 6, Number = 205, Location = RoomLocation.CapeTown, IsActive = true },
            
            // Johannesburg rooms
            new ConferenceRoom { Id = 11, Name = "Room A", Capacity = 10, Number = 301, Location = RoomLocation.Johannesburg, IsActive = true },
            new ConferenceRoom { Id = 12, Name = "Room B", Capacity = 8, Number = 302, Location = RoomLocation.Johannesburg, IsActive = true },
            new ConferenceRoom { Id = 13, Name = "Room C", Capacity = 15, Number = 303, Location = RoomLocation.Johannesburg, IsActive = true },
            new ConferenceRoom { Id = 14, Name = "Room D", Capacity = 20, Number = 304, Location = RoomLocation.Johannesburg, IsActive = true },
            new ConferenceRoom { Id = 15, Name = "Room E", Capacity = 6, Number = 305, Location = RoomLocation.Johannesburg, IsActive = true },
            
            // Bloemfontein rooms
            new ConferenceRoom { Id = 16, Name = "Room A", Capacity = 10, Number = 401, Location = RoomLocation.Bloemfontein, IsActive = true },
            new ConferenceRoom { Id = 17, Name = "Room B", Capacity = 8, Number = 402, Location = RoomLocation.Bloemfontein, IsActive = true },
            new ConferenceRoom { Id = 18, Name = "Room C", Capacity = 15, Number = 403, Location = RoomLocation.Bloemfontein, IsActive = true },
            new ConferenceRoom { Id = 19, Name = "Room D", Capacity = 20, Number = 404, Location = RoomLocation.Bloemfontein, IsActive = true },
            new ConferenceRoom { Id = 20, Name = "Room E", Capacity = 6, Number = 405, Location = RoomLocation.Bloemfontein, IsActive = true },
            
            // Durban rooms
            new ConferenceRoom { Id = 21, Name = "Room A", Capacity = 10, Number = 501, Location = RoomLocation.Durban, IsActive = true },
            new ConferenceRoom { Id = 22, Name = "Room B", Capacity = 8, Number = 502, Location = RoomLocation.Durban, IsActive = true },
            new ConferenceRoom { Id = 23, Name = "Room C", Capacity = 15, Number = 503, Location = RoomLocation.Durban, IsActive = true },
            new ConferenceRoom { Id = 24, Name = "Room D", Capacity = 20, Number = 504, Location = RoomLocation.Durban, IsActive = true },
            new ConferenceRoom { Id = 25, Name = "Room E", Capacity = 6, Number = 505, Location = RoomLocation.Durban, IsActive = true },
            
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
        // NOTE: Booking seed data removed because it requires UserId which is seeded at runtime
        // Bookings will be created through IdentitySeeder or API endpoints instead
        // This ensures proper foreign key relationship with ApplicationUser
    }

    public DbSet<ApplicationUser> ApplicationUsers { get; set; }
    public DbSet<Booking> Bookings { get; set; }
    public DbSet<ConferenceRoom> ConferenceRooms { get; set; }
    public DbSet<ConferenceSession> ConferenceSessions { get; set; }
    public DbSet<UserSession> UserSessions { get; set; }
    public DbSet<UserStatusHistory> UserStatusHistories { get; set; }
}