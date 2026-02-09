using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using System.Linq;
using System;
using Swashbuckle.AspNetCore;
using ConferenceBooking.API.Data;
using ConferenceBooking.API.Auth;
using Microsoft.EntityFrameworkCore;
using ConferenceBooking.Persistence;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using ConferenceBooking.API.Services;
using ConferenceBooking.API.Middleware;
using Microsoft.AspNetCore.Identity;

public partial class Program
{
    public static async Task Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Add services to the container.
        builder.Services.AddControllers();
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();

        builder.Services.AddDbContext<ApplicationDbContext>(options =>
        /*options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));*/
            options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

        builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddDefaultTokenProviders();

        // Initialize rooms and bookings from repository / file store
        var rooms = ConferenceRoomRepository.GetRooms();
        var roomsById = rooms.ToDictionary(r => r.Id);
        var bookings = BookingFileStore.LoadAsync(roomsById).GetAwaiter().GetResult();

        // Register BookingManager with persisted data
        builder.Services.AddSingleton<BookingManager>(_ => new BookingManager(rooms, bookings));

        // Register handlers for reuse; seed booking id counter from existing bookings
        var nextBookingId = bookings.Any() ? bookings.Max(b => b.Id) + 1 : 1;
        builder.Services.AddSingleton<BookRoomHandler>(_ => new BookRoomHandler(nextBookingId));
        builder.Services.AddSingleton<ViewAvailabilityHandler>();

        var app = builder.Build();

        // Seed roles and users
        using (var scope = app.Services.CreateScope())
        {
            var serviceProvider = scope.ServiceProvider;

            try
            {
                var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();
                var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();

                // IdentitySeeder.SeedAsync(userManager, roleManager).Wait();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error during seeding: {ex.Message}");
                throw;
            }
        }

        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseHttpsRedirection();

        app.UseAuthentication();
        app.UseAuthorization();

        // Add ExceptionHandlingMiddleware
        app.UseMiddleware<ExceptionHandlingMiddleware>();

        // Map controllers so API endpoints (POST/DELETE) are exposed
        app.MapControllers();

        app.Run();
    }
}
