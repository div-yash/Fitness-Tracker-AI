using dotnetapp.Models;
using dotnetapp.Data;
using Microsoft.EntityFrameworkCore;

namespace dotnetapp.Services
{
    public class WorkoutRequestService
    {
        private readonly ApplicationDbContext _context;
        public WorkoutRequestService(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<WorkoutRequest>> GetAllWorkoutRequests()
        {
            return await _context.WorkoutRequests.Include(wr => wr.User)
            .Include(wr => wr.Workout)
            .ToListAsync();
        }
        public async Task<bool> AddWorkoutRequest(WorkoutRequest workoutRequest)
        {
            await _context.WorkoutRequests.AddAsync(workoutRequest);
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<bool> UpdateWorkoutRequest(int workoutRequestId, WorkoutRequest workoutRequest)
        {
            var existingRequest = await _context.WorkoutRequests.FirstOrDefaultAsync(wr => wr.WorkoutRequestId == workoutRequestId);
            if (existingRequest == null)
            {
                return false;
            }
            existingRequest.RequestStatus = workoutRequest.RequestStatus;
            existingRequest.UserId = workoutRequest.UserId;
            existingRequest.WorkoutId = workoutRequest.WorkoutId;
            existingRequest.RequestedDate = workoutRequest.RequestedDate;
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<bool> DeleteWorkoutRequest(int workoutRequestId)
        {
            var request = await _context.WorkoutRequests
            .FirstOrDefaultAsync(wr => wr.WorkoutRequestId == workoutRequestId);
            if (request == null) return false;
            _context.WorkoutRequests.Remove(request);
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<IEnumerable<WorkoutRequest>> GetWorkoutRequestsByUserId(int userId)
        {
            return await _context.WorkoutRequests.
            Where(wr => wr.UserId == userId)
            .Include(wr => wr.User)
            .Include(wr => wr.Workout)
            .ToListAsync();
        }
    }
}