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

        // Configure Session-Room relationship
        modelBuilder.Entity<Session>()
            .HasOne(s => s.Room)
            .WithMany()
            .HasForeignKey(s => s.RoomId)
            .OnDelete(DeleteBehavior.SetNull);

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
            new ConferenceRoom { Id = 25, Name = "Meeting Room 1", Capacity = 6, Number = 505, Location = RoomLocation.Durban, IsActive = true }
        );
    }

    public DbSet<ApplicationUser> ApplicationUsers { get; set; }
    public DbSet<Booking> Bookings { get; set; }
    public DbSet<ConferenceRoom> ConferenceRooms { get; set; }
    public DbSet<Session> Sessions { get; set; }
}