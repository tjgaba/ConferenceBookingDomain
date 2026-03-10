using System;

namespace ConferenceBooking.API.Exceptions
{
    /// <summary>
    /// Exception thrown when there is a conflict with an existing booking.
    /// </summary>
    public class BookingConflictException : Exception
    {
        public BookingConflictException(string message)
            : base(message)
        {
        }
    }
}