using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using dotnetapp.Data;
using dotnetapp.Models;
using Microsoft.EntityFrameworkCore;

namespace dotnetapp.Services
{
    public class SymptomHistoryService
    {
        private readonly ApplicationDbContext _context;

        public SymptomHistoryService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<SymptomHistory>> GetAllSymptomHistories()
        {
            return await _context.SymptomHistories
                .OrderByDescending(s => s.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<SymptomHistory>> GetSymptomHistoriesByUserId(int userId)
        {
            return await _context.SymptomHistories
                .Where(s => s.UserId == userId)
                .OrderByDescending(s => s.CreatedAt)
                .ToListAsync();
        }

        public async Task<bool> AddSymptomHistory(SymptomHistory history)
        {
            if (history.CreatedAt == default)
            {
                history.CreatedAt = System.DateTime.UtcNow;
            }
            await _context.SymptomHistories.AddAsync(history);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteSymptomHistory(int id)
        {
            var item = await _context.SymptomHistories.FindAsync(id);
            if (item == null)
                return false;

            _context.SymptomHistories.Remove(item);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
