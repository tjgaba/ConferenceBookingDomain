using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace ConferenceBooking.Persistence
{
    public static class BookingFileStore
    {
        private const string FilePath = "Data/bookings.json";

        public static async Task SaveAsync(IEnumerable<Booking> bookings)
        {
            if (bookings == null)
                throw new ArgumentNullException(nameof(bookings));

            try
            {
                var directory = Path.GetDirectoryName(FilePath);
                if (!string.IsNullOrEmpty(directory))
                {
                    Directory.CreateDirectory(directory);
                }

                var records = bookings.Select(b => new BookingRecord
                {
                    Id = b.Id,
                    RoomId = b.Room.Id,
                    RequestedBy = b.RequestedBy,
                    StartTime = b.StartTime,
                    EndTime = b.EndTime,
                    Status = b.Status
                }).ToList();

                var json = JsonSerializer.Serialize(
                    records,
                    new JsonSerializerOptions { WriteIndented = true });

                await File.WriteAllTextAsync(FilePath, json)
                          .ConfigureAwait(false);
            }
            catch (IOException ex)
            {
                throw new BookingPersistenceException(
                    "Unable to save booking data to disk.", ex);
            }
        }

        public static async Task<List<Booking>> LoadAsync(
            IReadOnlyDictionary<int, ConferenceRoom> roomsById)
        {
            try
            {
                if (!File.Exists(FilePath))
                    return new List<Booking>();

                var json = await File.ReadAllTextAsync(FilePath)
                                     .ConfigureAwait(false);

                var records = JsonSerializer.Deserialize<List<BookingRecord>>(json)
                              ?? new List<BookingRecord>();

                var bookings = new List<Booking>();

                foreach (var record in records)
                {
                    if (!roomsById.TryGetValue(record.RoomId, out var room))
                        continue;

                    var booking = new Booking(
                        record.Id,
                        room,
                        record.RequestedBy,
                        record.StartTime,
                        record.EndTime,
                        record.Status
                    );

                    // The Booking constructor already sets the status from the record,
                    // so no need to call Confirm/Cancel here which may throw.
                    bookings.Add(booking);
                }

                return bookings;
            }
            catch (IOException ex)
            {
                throw new BookingPersistenceException(
                    "Unable to load booking data from disk.", ex);
            }
        }
    }
}
