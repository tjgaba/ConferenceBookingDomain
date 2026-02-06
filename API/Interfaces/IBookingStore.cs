using ConferenceBooking.Domain.Entities;

// TECH JARGON (domain interface / abstraction):
// This interface defines a contract for booking storage.
//
// SIMPLE MEANING:
// This describes WHAT storage must be able to do,
// without saying HOW it does it.

namespace ConferenceBooking.Domain.Interfaces;

public interface IBookingStore
{
    Task SaveAsync(Booking booking);

    // TECH JARGON (persistence contract):
    // Defines an asynchronous operation to save a booking.
    //
    // SIMPLE MEANING:
    // "Store this booking somewhere."

    Task<IReadOnlyList<Booking>> LoadAllAsync();

    // TECH JARGON (read-only collection):
    // Returns a list that cannot be modified by callers.
    //
    // SIMPLE MEANING:
    // "Give me all stored bookings, but don’t let me change them."
}