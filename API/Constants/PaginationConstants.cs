namespace ConferenceBooking.API.Constants
{
    /// <summary>
    /// Constants for pagination configuration
    /// </summary>
    public static class PaginationConstants
    {
        /// <summary>
        /// Default page number when not specified
        /// </summary>
        public const int DefaultPage = 1;

        /// <summary>
        /// Default page size when not specified
        /// </summary>
        public const int DefaultPageSize = 10;

        /// <summary>
        /// Maximum allowed page size to prevent performance issues
        /// </summary>
        public const int MaxPageSize = 100;

        /// <summary>
        /// Minimum valid page number
        /// </summary>
        public const int MinPage = 1;

        /// <summary>
        /// Minimum valid page size
        /// </summary>
        public const int MinPageSize = 1;
    }
}
