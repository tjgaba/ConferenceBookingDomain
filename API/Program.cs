using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using System.Linq;
using System;
using Swashbuckle.AspNetCore;
using ConferenceBooking.Persistence;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;

public partial class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Add services to the container.
        builder.Services.AddControllers();
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();

        // Initialize rooms and bookings from repository / file store
        var rooms = ConferenceRoomRepository.GetRooms();
        var roomsById = rooms.ToDictionary(r => r.Id);
        var bookings = BookingFileStore.LoadAsync(roomsById).GetAwaiter().GetResult();

        // Register BookingService with persisted data
        builder.Services.AddSingleton<BookingService>(_ => new BookingService(rooms, bookings));

        // Register handlers for reuse; seed booking id counter from existing bookings
        var nextBookingId = bookings.Any() ? bookings.Max(b => b.Id) + 1 : 1;
        builder.Services.AddSingleton<BookRoomHandler>(_ => new BookRoomHandler(nextBookingId));
        builder.Services.AddSingleton<ViewAvailabilityHandler>();

        var app = builder.Build();

        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseHttpsRedirection();

        var summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        // Map controllers so API endpoints (POST/DELETE) are exposed
        app.MapControllers();

        app.MapGet("/weatherforecast", () =>
        {
            var forecast =  Enumerable.Range(1, 5).Select(index =>
                new WeatherForecast
                (
                    DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
                    Random.Shared.Next(-20, 55),
                    summaries[Random.Shared.Next(summaries.Length)]
                ))
                .ToArray();
            return forecast;
        })
        .WithName("GetWeatherForecast");

        app.Run();
    }
}

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
