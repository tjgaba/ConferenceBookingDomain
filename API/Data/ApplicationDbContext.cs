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

        // Seed Conference Rooms
        modelBuilder.Entity<ConferenceRoom>().HasData(
            new ConferenceRoom { Id = 1, Name = "Conference Room A", Capacity = 10, Number = 101 },
            new ConferenceRoom { Id = 2, Name = "Conference Room B", Capacity = 8, Number = 102 },
            new ConferenceRoom { Id = 3, Name = "Conference Room C", Capacity = 15, Number = 103 },
            new ConferenceRoom { Id = 4, Name = "Board Room", Capacity = 20, Number = 201 },
            new ConferenceRoom { Id = 5, Name = "Meeting Room 1", Capacity = 6, Number = 104 }
        );
    }

    public DbSet<ApplicationUser> ApplicationUsers { get; set; }
    public DbSet<Booking> Bookings { get; set; }
    public DbSet<ConferenceRoom> ConferenceRooms { get; set; }
}