using ConferenceBooking.Domain.Entities;



namespace ConferenceBooking.Domain.Interfaces;

public interface IBookingStore
{
    Task SaveAsync(Booking booking);

    Task<IReadOnlyList<Booking>> LoadAllAsync();

}