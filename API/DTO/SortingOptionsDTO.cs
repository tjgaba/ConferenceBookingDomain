using System.Collections.Generic;

namespace ConferenceBooking.API.DTO
{
    /// <summary>
    /// Available sorting options for bookings
    /// </summary>
    public class SortingOptionsDTO
    {
        /// <summary>
        /// Available fields to sort by
        /// </summary>
        public List<SortFieldDTO> AvailableFields { get; set; } = new List<SortFieldDTO>();

        /// <summary>
        /// Available sort orders
        /// </summary>
        public List<SortOrderDTO> AvailableOrders { get; set; } = new List<SortOrderDTO>();

        /// <summary>
        /// Default sorting field
        /// </summary>
        public string DefaultField { get; set; } = "CreatedAt";

        /// <summary>
        /// Default sort order
        /// </summary>
        public string DefaultOrder { get; set; } = "desc";
    }

    /// <summary>
    /// Sorting field option
    /// </summary>
    public class SortFieldDTO
    {
        /// <summary>
        /// Field name to use in API query parameter
        /// </summary>
        public string Value { get; set; } = string.Empty;

        /// <summary>
        /// Human-readable description
        /// </summary>
        public string Description { get; set; } = string.Empty;
    }

    /// <summary>
    /// Sort order option
    /// </summary>
    public class SortOrderDTO
    {
        /// <summary>
        /// Order value (asc/desc)
        /// </summary>
        public string Value { get; set; } = string.Empty;

        /// <summary>
        /// Human-readable description
        /// </summary>
        public string Description { get; set; } = string.Empty;
    }
}
