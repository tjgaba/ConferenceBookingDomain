// UpdateBookingDTO.js
//
// Frontend mirror of the .NET UpdateBookingDTO.
// Mirrors: API/DTO/UpdateBookingDTO.cs
//
// .NET shape:
//   int      BookingId  [Required]
//   int?     RoomId
//   string?  RequestedBy
//   DateTimeOffset? StartTime
//   DateTimeOffset? EndTime
//   string?  Status
//
// All fields except bookingId are optional — only truthy / explicitly provided
// values are included in the payload so the .NET model binder treats absent
// keys as "no change" rather than null-overwrite.

/**
 * Build a payload that exactly matches UpdateBookingDTO.
 *
 * @param {number} bookingId
 * @param {{ roomId?: number, startTime?: string, endTime?: string, status?: string }} data
 * @returns {{ bookingId: number, roomId?: number, startTime?: string, endTime?: string, status?: string }}
 */
export function updateBookingDTO(bookingId, data) {
  if (!bookingId) throw new Error('UpdateBookingDTO: bookingId is required.');

  const payload = { bookingId: Number(bookingId) };

  if (data.roomId    !== undefined) payload.roomId    = Number(data.roomId);
  if (data.startTime !== undefined) payload.startTime = String(data.startTime);
  if (data.endTime   !== undefined) payload.endTime   = String(data.endTime);
  if (data.status    !== undefined) payload.status    = String(data.status);

  return payload;
}
