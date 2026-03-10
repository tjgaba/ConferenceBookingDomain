using System.Collections.Generic;
using ConferenceBooking.API.Entities;
using Microsoft.EntityFrameworkCore;

namespace ConferenceBooking.API.Data
{
    public class ConferenceRoomRepository
    {
        private readonly ApplicationDbContext _dbContext;

        public ConferenceRoomRepository(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<ConferenceRoom>> GetAllRoomsAsync()
        {
            return await _dbContext.ConferenceRooms.ToListAsync();
        }

        public async Task<ConferenceRoom?> GetRoomByIdAsync(int id)
        {
            return await _dbContext.ConferenceRooms.FirstOrDefaultAsync(r => r.Id == id);
        }

        public async Task AddRoomAsync(ConferenceRoom room)
        {
            await _dbContext.ConferenceRooms.AddAsync(room);
            await _dbContext.SaveChangesAsync();
        }

        public async Task UpdateRoomAsync(ConferenceRoom room)
        {
            _dbContext.ConferenceRooms.Update(room);
            await _dbContext.SaveChangesAsync();
        }

        public async Task DeleteRoomAsync(int id)
        {
            var room = await GetRoomByIdAsync(id);
            if (room != null)
            {
                _dbContext.ConferenceRooms.Remove(room);
                await _dbContext.SaveChangesAsync();
            }
        }
    }
}
