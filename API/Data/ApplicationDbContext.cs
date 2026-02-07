using Microsoft.EntityFrameworkCore;
using API.Auth;

namespace API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<ApplicationUser> Users { get; set; }

        // Add other DbSet properties for your entities here
        // Example: public DbSet<Booking> Bookings { get; set; }
    }
}