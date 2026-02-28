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
using ConferenceBooking.API.Hubs;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

public partial class Program
{
    public static async Task Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Add services to the container.
        builder.Services.AddControllers();
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();

        // PostgreSQL Configuration
        builder.Services.AddDbContext<ApplicationDbContext>(options =>
            options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

        // Move Identity and TokenService registration before app is built
        builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddDefaultTokenProviders();

        // Configure JWT Authentication
        builder.Services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = builder.Configuration["Jwt:Issuer"],
                ValidAudience = builder.Configuration["Jwt:Audience"],
                IssuerSigningKey = new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key not configured")))
            };
            // SignalR sends the JWT as a query param (?access_token=...) during
            // the WebSocket handshake because browsers cannot set custom headers
            // on WebSocket connections. Read it here and use it as the bearer token.
            options.Events = new JwtBearerEvents
            {
                OnMessageReceived = context =>
                {
                    var accessToken = context.Request.Query["access_token"];
                    var path = context.HttpContext.Request.Path;
                    if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/hubs"))
                        context.Token = accessToken;
                    return Task.CompletedTask;
                }
            };
        });

        builder.Services.AddScoped<TokenService>();
        builder.Services.AddScoped<ISessionManager, SessionManager>();

        // Add CORS policy for React frontend
        // AllowAnyMethod() is required for SignalR — the WebSocket/SSE negotiation
        // uses methods beyond GET/POST/PUT/DELETE that WithMethods() would block.
        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowReactApp", policy =>
            {
                policy.WithOrigins("http://localhost:5173") // Vite's default port
                      .AllowAnyHeader()
                      .AllowAnyMethod()
                      .AllowCredentials();
            });
        });

        // SignalR — real-time booking notifications
        builder.Services.AddSignalR();

        // Register BookingManager with ApplicationDbContext
        builder.Services.AddScoped<BookingManager>();
        
        // Register BookingRepository
        builder.Services.AddScoped<BookingRepository>();

        // Register BookingValidationService for domain rule enforcement
        builder.Services.AddScoped<BookingValidationService>();

        // Register UserManagementService
        builder.Services.AddScoped<UserManagementService>();

        // Register RoomManagementService
        builder.Services.AddScoped<RoomManagementService>();

        // Register SessionManagementService
        builder.Services.AddScoped<SessionManagementService>();

        // Register BookingManagementService
        builder.Services.AddScoped<BookingManagementService>();

        // Seed roles and users
        var app = builder.Build();

        // Auto-apply EF Core migrations on startup (safe to run on every boot — skips already-applied migrations)
        // This means running on a fresh machine / Docker container just works without manual 'dotnet ef database update'
        using (var scope = app.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            try
            {
                await db.Database.MigrateAsync();
                Console.WriteLine("✓ Database migrations applied.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Migration error: {ex.Message}");
                throw;
            }
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

        app.UseRouting();

        // Apply CORS policy - must be after UseRouting() and before UseAuthentication()
        app.UseCors("AllowReactApp");

        app.UseAuthentication();
        
        app.UseAuthorization();
        
        // Add SessionValidationMiddleware - after UseAuthorization to respect [AllowAnonymous]
        app.UseMiddleware<SessionValidationMiddleware>();

        // Add ExceptionHandlingMiddleware
        app.UseMiddleware<ExceptionHandlingMiddleware>();

        // Health check endpoint — anonymous, used by frontend ConnectionStatus component
        app.MapGet("/api/health", () => Results.Ok(new { status = "Healthy", timestamp = DateTime.UtcNow }))
           .AllowAnonymous();

        // Map controllers so API endpoints (POST/DELETE) are exposed
        app.MapControllers();

        // Map the SignalR booking hub
        app.MapHub<BookingHub>("/hubs/booking");

        app.Run();
    }
}
