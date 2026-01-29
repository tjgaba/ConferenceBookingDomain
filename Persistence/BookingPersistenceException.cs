using System;

namespace ConferenceBooking.Persistence
{
    public class BookingPersistenceException : Exception
    {
        public BookingPersistenceException(string message, Exception innerException)
            : base(message, innerException)
        {
        }
    }
}
