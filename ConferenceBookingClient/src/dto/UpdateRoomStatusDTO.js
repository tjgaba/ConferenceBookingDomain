// UpdateRoomStatusDTO.js
//
// Frontend mirror of the .NET UpdateRoomStatusDTO.
// Mirrors: API/DTO/UpdateRoomStatusDTO.cs
//
// .NET shape:
//   bool IsActive

/**
 * Build a payload that exactly matches UpdateRoomStatusDTO.
 *
 * @param {boolean} isActive
 * @returns {{ isActive: boolean }}
 */
export function updateRoomStatusDTO(isActive) {
  if (typeof isActive !== 'boolean')
    throw new Error('UpdateRoomStatusDTO: isActive must be a boolean.');

  return { isActive };
}
