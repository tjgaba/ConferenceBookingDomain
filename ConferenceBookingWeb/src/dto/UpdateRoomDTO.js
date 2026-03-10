// UpdateRoomDTO.js
//
// Frontend mirror of the .NET UpdateRoomDTO.
// Mirrors: API/DTO/UpdateRoomDTO.cs
//
// .NET shape (all fields optional — omit to leave unchanged):
//   string?       Name
//   int?          Capacity  [Range(1, int.MaxValue)]
//   int?          Number
//   RoomLocation? Location  — one of: London | CapeTown | Johannesburg | Bloemfontein | Durban
//   bool?         IsActive

import { ROOM_LOCATIONS } from './CreateRoomDTO';

/**
 * Build a payload that exactly matches UpdateRoomDTO.
 * Only fields that are explicitly provided (not undefined) are included.
 *
 * @param {{ name?: string, capacity?: number, number?: number, location?: string, isActive?: boolean }} data
 * @returns {Object}
 */
export function updateRoomDTO(data) {
  const payload = {};

  if (data.name     !== undefined) payload.name     = String(data.name);
  if (data.capacity !== undefined) {
    if (data.capacity < 1) throw new Error('UpdateRoomDTO: capacity must be at least 1.');
    payload.capacity = Number(data.capacity);
  }
  if (data.number   !== undefined) payload.number   = Number(data.number);
  if (data.location !== undefined) {
    if (!ROOM_LOCATIONS.includes(data.location))
      throw new Error(`UpdateRoomDTO: location must be one of ${ROOM_LOCATIONS.join(', ')}.`);
    payload.location = String(data.location);
  }
  if (data.isActive !== undefined) payload.isActive = Boolean(data.isActive);

  return payload;
}
