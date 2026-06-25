namespace dotnetapp.Models
{
    public class Workout
    {
        public int WorkoutId { get; set; }
        public string WorkoutName { get; set; }
        public string Description { get; set; }
        public int DifficultyLevel { get; set; }
        public DateTime CreatedAt { get; set; }
        public string TargetArea { get; set; }
        public int DaysPerWeek { get; set; }
        public int AverageWorkoutDurationInMinutes { get; set; }
    }
}