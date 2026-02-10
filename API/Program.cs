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
            options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

        // Move Identity and TokenService registration before app is built
        builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddDefaultTokenProviders();

        builder.Services.AddScoped<TokenService>();

        // Register BookingManager with ApplicationDbContext
        builder.Services.AddScoped<BookingManager>();

        // Remove unused handlers
        builder.Services.AddScoped<BookRoomHandler>();
        builder.Services.AddScoped<ViewAvailabilityHandler>();

        // Seed roles and users
        var app = builder.Build();

        // Ensure database is created after app is built
        using (var scope = app.Services.CreateScope())
        {
            var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            dbContext.Database.Migrate();
        }

        // Seed roles and users
        using (var scope = app.Services.CreateScope())
        {
            var serviceProvider = scope.ServiceProvider;

            try
            {
                var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();
                var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();

                IdentitySeeder.SeedAsync(userManager, roleManager).Wait();
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
