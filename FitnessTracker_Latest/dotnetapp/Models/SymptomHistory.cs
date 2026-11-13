using System;
using System.ComponentModel.DataAnnotations;

namespace dotnetapp.Models
{
    public class SymptomHistory
    {
        [Key]
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Symptoms { get; set; } = string.Empty;
        public string PredictedDisease { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Precautions { get; set; }
        public string? Medications { get; set; }
        public string? Diets { get; set; }
        public string? Workouts { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
