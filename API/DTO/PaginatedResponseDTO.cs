using System.Collections.Generic;

namespace ConferenceBooking.API.DTO
{
    /// <summary>
    /// Generic paginated response wrapper
    /// </summary>
    /// <typeparam name="T">Type of data being paginated</typeparam>
    public class PaginatedResponseDTO<T>
    {
        /// <summary>
        /// Current page number (1-based)
        /// </summary>
        public int CurrentPage { get; set; }

        /// <summary>
        /// Number of items per page
        /// </summary>
        public int PageSize { get; set; }

        /// <summary>
        /// Total number of records across all pages
        /// </summary>
        public int TotalRecords { get; set; }

        /// <summary>
        /// Total number of pages
        /// </summary>
        public int TotalPages { get; set; }

        /// <summary>
        /// The paginated data for the current page
        /// </summary>
        public List<T> Data { get; set; } = new List<T>();

        /// <summary>
        /// Field used for sorting (Date, RoomName, CreatedAt)
        /// </summary>
        public string? SortBy { get; set; }

        /// <summary>
        /// Sort order (asc or desc)
        /// </summary>
        public string SortOrder { get; set; } = "desc";

        /// <summary>
        /// Whether there is a previous page
        /// </summary>
        public bool HasPrevious => CurrentPage > 1;

        /// <summary>
        /// Whether there is a next page
        /// </summary>
        public bool HasNext => CurrentPage < TotalPages;
    }
}
