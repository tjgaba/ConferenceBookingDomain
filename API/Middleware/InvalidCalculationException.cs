using System;

namespace ConferenceBooking.API.Middleware
{
    /// <summary>
    /// Custom exception for invalid calculations.
    /// </summary>
    public class InvalidCalculationException : Exception
    {
        public InvalidCalculationException(string message)
            : base(message)
        {
        }
    }
}