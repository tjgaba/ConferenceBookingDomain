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
    }
}
