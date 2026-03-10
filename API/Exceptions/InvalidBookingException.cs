using System;

/// <summary>
/// Custom domain-specific exception.
/// Used when a booking violates business rules.
/// This makes failures explicit and meaningful.
/// </summary>
namespace ConferenceBooking.API.Exceptions
{
    public class InvalidBookingException : Exception
    {
        public InvalidBookingException(string message)
            : base(message)
        {
        }
    }
}