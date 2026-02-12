namespace ConferenceBooking.API.DTO
{
    /// <summary>
    /// DTO for pagination parameters
    /// </summary>
    public class PaginationRequestDTO
    {
        /// <summary>
        /// Page number (1-based index)
        /// </summary>
        public int Page { get; set; } = 1;

        /// <summary>
        /// Number of items per page
        /// </summary>
        public int PageSize { get; set; } = 10;

        /// <summary>
        /// Field to sort by. Supported values: Date, RoomName, CreatedAt
        /// </summary>
        public string? SortBy { get; set; }

        /// <summary>
        /// Sort order: asc or desc (default: desc)
        /// </summary>
        public string SortOrder { get; set; } = "desc";
    }
}
