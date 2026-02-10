using System.Collections.Generic;
using System.Threading.Tasks;
using ConferenceBooking.API.Services;
using ConferenceBooking.API.DTO;
using ConferenceBooking.API.Auth;
using ConferenceBooking.API.Exceptions;
using ConferenceBooking.API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ConferenceBooking.API.Models; // Added namespace for Booking
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

[ApiController]
[Route("api/[controller]")]
[Authorize] // Protect all endpoints in this controller
public class BookingController : ControllerBase
{
    private readonly BookingManager _bookingManager;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ILogger<BookingController> _logger;

    public BookingController(BookingManager bookingManager, UserManager<ApplicationUser> userManager, ILogger<BookingController> logger)
    {
        _bookingManager = bookingManager;
        _userManager = userManager;
        _logger = logger;
    }

    [HttpPost("book")]
    public async Task<IActionResult> CreateBooking([FromBody] CreateBookingRequestDTO dto)
    {
        _logger.LogInformation("CreateBooking endpoint hit"); // Logging to verify request reaches the controller

        if (User.Identity?.Name == null)
        {
            _logger.LogWarning("User.Identity.Name is null"); // Logging for debugging
            return Unauthorized();
        }

        var user = await _userManager.FindByNameAsync(User.Identity.Name);
        if (user == null)
        {
            _logger.LogWarning("User not found or unauthorized"); // Logging for debugging
            return Unauthorized();
        }

        var room = _bookingManager.ValidateAndGetFirstAvailableRoom(dto.StartDate, dto.EndDate);

        var booking = new Booking(
            _bookingManager.GenerateBookingId(), // Auto-incremented booking ID
            room, // Dynamically fetched room
            user.UserName ?? "Unknown User", // Fallback for null UserName
            dto.StartDate,
            dto.EndDate,
            BookingStatus.Confirmed
        );

        var result = _bookingManager.CreateBooking(
            booking.Id,
            booking.Room.Id,
            booking.RequestedBy,
            booking.StartTime,
            booking.EndTime - booking.StartTime
        );

        _logger.LogInformation(result.IsSuccess ? "Booking created successfully" : $"Booking creation failed: {result.ErrorMessage}"); // Logging result

        return result.IsSuccess
            ? Ok(result.Value)
            : Conflict(new { Message = result.ErrorMessage });
    }

    [HttpDelete("cancel/{id}")]
    public IActionResult CancelBooking(int id)
    {
        _bookingManager.CancelBooking(id);
        return NoContent();
    }
}