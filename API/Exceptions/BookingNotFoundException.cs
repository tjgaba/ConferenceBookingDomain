using System;

namespace ConferenceBooking.API.Exceptions
{
    /// <summary>
    /// Exception thrown when a booking cannot be found.
    /// </summary>
    public class BookingNotFoundException : Exception
    {
        public BookingNotFoundException(string message)
            : base(message)
        {
        }
    }
}