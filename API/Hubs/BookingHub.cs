using Microsoft.AspNetCore.SignalR;

namespace ConferenceBooking.API.Hubs
{
    /// <summary>
    /// SignalR Hub for real-time booking notifications.
    /// Connected clients are pushed a message whenever a booking is created or updated.
    /// The hub itself is thin — all broadcast logic lives in the controller via IHubContext.
    /// </summary>
    public class BookingHub : Hub
    {
        // No server-side methods needed — the hub is receive-only from the client's perspective.
        // Controllers broadcast to all clients via IHubContext<BookingHub>.
    }
}
