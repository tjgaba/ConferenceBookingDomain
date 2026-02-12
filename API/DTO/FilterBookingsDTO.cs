using System;
using ConferenceBooking.API.Entities;

namespace ConferenceBooking.API.DTO
{
    /// <summary>
    /// DTO for filtering bookings by various criteria
    /// </summary>
    public class FilterBookingsDTO
    {
        /// <summary>
        /// Filter by room name (optional)
        /// </summary>
        public string? RoomName { get; set; }

        /// <summary>
        /// Filter by location (optional)
        /// </summary>
        public RoomLocation? Location { get; set; }

        /// <summary>
        /// Filter by start date (inclusive, optional)
        /// </summary>
        public DateTimeOffset? StartDate { get; set; }

        /// <summary>
        /// Filter by end date (inclusive, optional)
        /// </summary>
        public DateTimeOffset? EndDate { get; set; }

        /// <summary>
        /// Filter by room active status (optional)
        /// </summary>
        public bool? IsActiveRoom { get; set; }

        /// <summary>
        /// Filter by booking status (optional)
        /// </summary>
        public string? Status { get; set; }
    }
}
