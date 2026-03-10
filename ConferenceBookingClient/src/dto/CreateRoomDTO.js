// CreateRoomDTO.js
//
// Frontend mirror of the .NET CreateRoomDTO.
// Mirrors: API/DTO/CreateRoomDTO.cs
//
// .NET shape:
//   string       Name      [Required]
//   int          Capacity  [Required, Range(1, int.MaxValue)]
//   int          Number    [Required]
//   RoomLocation Location  [Required]  — one of: London | CapeTown | Johannesburg | Bloemfontein | Durban
//   bool         IsActive  (default: true)

export const ROOM_LOCATIONS = ['London', 'CapeTown', 'Johannesburg', 'Bloemfontein', 'Durban'];

/**
 * Build a payload that exactly matches CreateRoomDTO.
 *
 * @param {{ name: string, capacity: number, number: number, location: string, isActive?: boolean }} data
 * @returns {{ name: string, capacity: number, number: number, location: string, isActive: boolean }}
 */
export function createRoomDTO(data) {
  const { name, capacity, number, location, isActive = true } = data;

  if (!name)     throw new Error('CreateRoomDTO: name is required.');
  if (!capacity || capacity < 1)
    throw new Error('CreateRoomDTO: capacity must be at least 1.');
  if (number === undefined || number === null || number === '')
    throw new Error('CreateRoomDTO: number is required.');
  if (!location || !ROOM_LOCATIONS.includes(location))
    throw new Error(`CreateRoomDTO: location must be one of ${ROOM_LOCATIONS.join(', ')}.`);

  return {
    name:     String(name),
    capacity: Number(capacity),
    number:   Number(number),
    location: String(location),
    isActive: Boolean(isActive),
  };
}
