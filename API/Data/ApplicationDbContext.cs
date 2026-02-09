using Microsoft.EntityFrameworkCore;
using ConferenceBooking.API.Auth;
using ConferenceBooking.API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace ConferenceBooking.API.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<ConferenceRoom> ConferenceRooms { get; set; }
        public DbSet<ApplicationUser> Users { get; set; }

        // Add other DbSet properties for your entities here
        // Example: public DbSet<Booking> Bookings { get; set; }
    }
}