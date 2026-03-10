// CreateBookingRequestDTO.js
//
// Frontend mirror of the .NET CreateBookingRequestDTO.
// Mirrors: API/DTO/CreateBookingRequestDTO.cs
//
// .NET shape:
//   int      RoomId    [Required]
//   DateTimeOffset StartDate [Required]
//   DateTimeOffset EndDate   [Required]
//   string   Location  [Required]
//   int      Capacity  [Required, Range(1, int.MaxValue)]
//
// The factory validates required fields and throws a descriptive error
// before the Axios call so failures surface immediately in the console.

/**
 * Build a payload that exactly matches CreateBookingRequestDTO.
 *
 * @param {{ roomId: number, startDate: string, endDate: string, location: string, capacity: number }} data
 * @returns {{ roomId: number, startDate: string, endDate: string, location: string, capacity: number }}
 */
export function createBookingRequestDTO(data) {
  const { roomId, startDate, endDate, location, capacity } = data;

  if (!roomId)    throw new Error('CreateBookingRequestDTO: roomId is required.');
  if (!startDate) throw new Error('CreateBookingRequestDTO: startDate is required.');
  if (!endDate)   throw new Error('CreateBookingRequestDTO: endDate is required.');
  if (!location)  throw new Error('CreateBookingRequestDTO: location is required.');
  if (!capacity || capacity < 1)
    throw new Error('CreateBookingRequestDTO: capacity must be at least 1.');

  return {
    roomId:    Number(roomId),
    startDate: String(startDate),
    endDate:   String(endDate),
    location:  String(location),
    capacity:  Number(capacity),
  };
}
