using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using System.Linq;
using System;
using Swashbuckle.AspNetCore;
using ConferenceBooking.Persistence;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using ConferenceBooking.API.Services;
using ConferenceBooking.API.Middleware;

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

        // Register BookingManager with persisted data
        builder.Services.AddSingleton<BookingManager>(_ => new BookingManager(rooms, bookings));

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

        // Add ExceptionHandlingMiddleware
        app.UseMiddleware<ExceptionHandlingMiddleware>();

        // Map controllers so API endpoints (POST/DELETE) are exposed
        app.MapControllers();

        app.Run();
    }
}
