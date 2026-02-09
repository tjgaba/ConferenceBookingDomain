using System;
using System.Collections.Generic;
using System.Linq;
using System.IO;
using System.Text.Json;
using System.Threading.Tasks;
using ConferenceBooking.Persistence;
using ConferenceBooking.API.Exceptions;
using ConferenceBooking.API.Entities;
using ConferenceBooking.API.Services;

namespace ConferenceBooking.API.Services
{
    public class BookingManager
    {
        private readonly List<Booking> _bookings;
        private readonly Dictionary<int, ConferenceRoom> _roomsById;
        private int _nextBookingId = 1; // Initialize booking ID counter

        public BookingManager(
            List<ConferenceRoom> rooms,
            List<Booking> bookings)
        {
            Console.WriteLine("[DEBUG] Initializing BookingManager with rooms:");
            foreach (var room in rooms)
            {
                Console.WriteLine($"[DEBUG] Room ID: {room.Id}, Name: {room.Name}, Capacity: {room.Capacity}");
            }

            _roomsById = rooms.ToDictionary(r => r.Id);
            _bookings = bookings;
        }

        public IEnumerable<ConferenceRoom> GetAvailableRooms(DateTimeOffset atTime)
        {
            return _roomsById.Values.Where(room =>
                !_bookings.Any(b =>
                    b.Room.Id == room.Id &&
                    b.Status == ConferenceBooking.API.Entities.BookingStatus.Confirmed &&
                    b.StartTime <= atTime &&
                    atTime < b.EndTime
                )
            );
        }

        public Booking? GetActiveBookingForRoom(
            int roomId,
            DateTimeOffset atTime)
        {
            return _bookings.FirstOrDefault(b =>
                b.Room.Id == roomId &&
                b.Status == ConferenceBooking.API.Entities.BookingStatus.Confirmed &&
                b.StartTime <= atTime &&
                atTime < b.EndTime
            );
        }

        public Booking? GetNextBookingForRoom(int roomId, DateTimeOffset atTime)
        {
            return _bookings
                .Where(b => b.Room.Id == roomId && b.StartTime > atTime)
                .OrderBy(b => b.StartTime)
                .FirstOrDefault();
        }

        public Resulting<Booking> CreateBooking(
            int bookingId,
            int roomId,
            string requestedBy,
            DateTimeOffset startTime,
            TimeSpan duration)
        {
            if (!_roomsById.ContainsKey(roomId))
            {
                Console.WriteLine($"[DEBUG] Room ID {roomId} does not exist.");
                return Resulting<Booking>.Failure("Room does not exist.");
            }

            var room = _roomsById[roomId];
            var endTime = startTime + duration;

            if (_bookings.Any(b =>
                b.Room.Id == roomId &&
                b.Status == ConferenceBooking.API.Entities.BookingStatus.Confirmed &&
                b.StartTime < endTime &&
                startTime < b.EndTime))
            {
                return Resulting<Booking>.Failure("Room is not available during the requested time.");
            }

            var booking = new Booking(
                bookingId,
                room,
                requestedBy,
                startTime,
                endTime,
                BookingStatus.Confirmed
            );

            _bookings.Add(booking);
            return Resulting<Booking>.Success(booking);
        }

        public async Task LoadBookingsAsync(string filePath)
        {
            if (!File.Exists(filePath)) return;

            var json = await File.ReadAllTextAsync(filePath);
            var bookings = JsonSerializer.Deserialize<List<BookingRecord>>(json);

            foreach (var record in bookings ?? Enumerable.Empty<BookingRecord>())
            {
                if (_roomsById.TryGetValue(record.RoomId, out var room))
                {
                    _bookings.Add(new Booking(
                        record.Id,
                        room,
                        record.RequestedBy,
                        record.StartTime,
                        record.EndTime,
                        record.Status
                    ));
                }
            }
        }

        public async Task SaveBookingsAsync(string filePath)
        {
            var records = _bookings.Select(b => new BookingRecord
            {
                Id = b.Id,
                RoomId = b.Room.Id,
                RequestedBy = b.RequestedBy,
                StartTime = b.StartTime,
                EndTime = b.EndTime,
                Status = (ConferenceBooking.API.Entities.BookingStatus)b.Status
            });

            var json = JsonSerializer.Serialize(records);
            await File.WriteAllTextAsync(filePath, json);
        }

        public IReadOnlyList<Booking> GetAllBookings() => _bookings.AsReadOnly();

        public void CancelBooking(int bookingId)
        {
            var booking = _bookings.FirstOrDefault(b => b.Id == bookingId);
            if (booking == null)
                throw new ArgumentException("Booking not found.");

            if (booking.Status == ConferenceBooking.API.Entities.BookingStatus.Cancelled)
                throw new InvalidOperationException("Booking is already cancelled.");

            booking.Status = ConferenceBooking.API.Entities.BookingStatus.Cancelled;
        }

        public void CancelBooking(int bookingId, string reason)
        {
            var booking = _bookings.FirstOrDefault(b => b.Id == bookingId);
            if (booking == null)
                throw new ArgumentException("Booking not found.");

            if (booking.Status == ConferenceBooking.API.Entities.BookingStatus.Cancelled)
                throw new InvalidOperationException("Booking is already cancelled.");

            booking.Status = ConferenceBooking.API.Entities.BookingStatus.Cancelled;
            // Log or store the reason for cancellation if needed
        }

        public bool DeleteBooking(int bookingId)
        {
            var booking = _bookings.FirstOrDefault(b => b.Id == bookingId);
            if (booking == null)
            {
                return false;
            }

            _bookings.Remove(booking);
            return true;
        }

        public ConferenceRoom GetFirstAvailableRoom(DateTimeOffset startTime)
        {
            var availableRooms = GetAvailableRooms(startTime);
            var room = availableRooms.FirstOrDefault();

            if (room == null)
            {
                throw new InvalidBookingException("No available rooms for the specified time.");
            }

            return room;
        }

        public ConferenceRoom ValidateAndGetFirstAvailableRoom(DateTimeOffset startDate, DateTimeOffset endDate)
        {
            if (endDate <= startDate)
            {
                throw new InvalidBookingException("End date must be after start date.");
            }

            return GetFirstAvailableRoom(startDate);
        }

        public ConferenceRoom? GetRoomByNumber(int roomNumber)
        {
            return _roomsById.Values.FirstOrDefault(r => r.Number == roomNumber);
        }

        public bool IsRoomAvailable(int roomId, DateTimeOffset atTime)
        {
            if (!_roomsById.TryGetValue(roomId, out var room)) return false;

            return !_bookings.Any(b => b.Room.Id == roomId &&
                                   b.StartTime <= atTime &&
                                   b.EndTime >= atTime);
        }

        public class Resulting
        {
            public bool IsSuccess { get; }
            public string ErrorMessage { get; }

            protected Resulting(bool isSuccess, string errorMessage)
            {
                IsSuccess = isSuccess;
                ErrorMessage = errorMessage;
            }

            public static Resulting Success() => new Resulting(true, string.Empty);
            public static Resulting Failure(string errorMessage) => new Resulting(false, errorMessage);
        }

        public class Resulting<T> : Resulting
        {
            public T Value { get; }

            private Resulting(bool isSuccess, string errorMessage, T value)
                : base(isSuccess, errorMessage)
            {
                Value = value;
            }

            public static Resulting<T> Success(T value) => new Resulting<T>(true, string.Empty, value);
            public new static Resulting<T> Failure(string errorMessage) => new Resulting<T>(false, errorMessage, default!);
        }

        public int GenerateBookingId()
        {
            return _nextBookingId++;
        }
    }
}