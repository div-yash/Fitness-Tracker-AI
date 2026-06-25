using dotnetapp.Data;
using dotnetapp.Exceptions;
using dotnetapp.Models;
using Microsoft.EntityFrameworkCore;

namespace dotnetapp.Services
{
    public class WorkoutService
    {
        private readonly ApplicationDbContext _context;
        public WorkoutService(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<Workout>> GetAllWorkouts()
        {
            return await _context.Workouts.ToListAsync();

        }
        public async Task<Workout?> GetWorkoutById(int workoutId)
        {
            var workout = await _context.Workouts.FindAsync(workoutId);
            return workout;
        }
        public async Task<bool> AddWorkout(Workout workout)
        {
            var workouts = await _context.Workouts.AnyAsync(w => w.WorkoutName == workout.WorkoutName);
            if (workouts)
                throw new WorkoutException("Workout with the same name already exists");

            _context.Workouts.Add(workout);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateWorkout(int workoutId, Workout workout)
        {
            var workoutExisting = await _context.Workouts.FirstOrDefaultAsync(w => w.WorkoutId == workoutId);
            if (workoutExisting == null)
            {
                return false;
            }
            workoutExisting.WorkoutName = workout.WorkoutName;
            workoutExisting.Description = workout.Description;
            workoutExisting.DifficultyLevel = workout.DifficultyLevel;
            workoutExisting.CreatedAt = workout.CreatedAt;
            workoutExisting.TargetArea = workout.TargetArea;
            workoutExisting.DaysPerWeek = workout.DaysPerWeek;
            workoutExisting.AverageWorkoutDurationInMinutes = workout.AverageWorkoutDurationInMinutes;
            _context.Workouts.Update(workoutExisting);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteWorkout(int workoutId)
        {
            var workout = await _context.Workouts.FirstOrDefaultAsync(w => w.WorkoutId == workoutId);
            if (workout == null)
            {
                return false;
            }
            _context.Workouts.Remove(workout);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}