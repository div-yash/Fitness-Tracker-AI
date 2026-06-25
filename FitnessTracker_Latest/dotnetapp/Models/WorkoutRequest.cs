using System.Text.Json.Serialization;

namespace dotnetapp.Models
{
    public class WorkoutRequest
    {
        public int WorkoutRequestId { get; set; }
        public int UserId { get; set; }
        public User? User { get; set; }
        public int WorkoutId { get; set; }
        public Workout? Workout { get; set; }
        public int Age { get; set; }
        public double BMI { get; set; }
        public string Gender { get; set; }
        public string DietaryPreferences { get; set; }
        public string MedicalHistory { get; set; }
        public DateTime RequestedDate { get; set; }
        public string RequestStatus { get; set; }
    }
}