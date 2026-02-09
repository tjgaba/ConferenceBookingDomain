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

[ApiController]
[Route("api/[controller]")]
[Authorize] // Protect all endpoints in this controller
public class BookingController : ControllerBase
{
    private readonly BookingManager _bookingManager;

    public BookingController(BookingManager bookingManager)
    {
        _bookingManager = bookingManager;
    }

    [HttpPost("book")]
    public IActionResult CreateBooking([FromBody] CreateBookingRequestDTO dto)
    {
        var room = _bookingManager.ValidateAndGetFirstAvailableRoom(dto.StartDate, dto.EndDate);

        var userName = User.Identity?.Name ?? "Anonymous";
        var roles = User.IsInRole("Admin") ? "Admin" :
                    User.IsInRole("Receptionist") ? "Receptionist" :
                    User.IsInRole("Employee") ? "Employee" :
                    User.IsInRole("FacilityManager") ? "FacilityManager" : "User";

        var booking = new Booking(
            _bookingManager.GenerateBookingId(), // Auto-incremented booking ID
            room, // Dynamically fetched room
            userName, // Dynamically fetched user
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