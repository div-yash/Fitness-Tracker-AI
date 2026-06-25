using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace dotnetapp.Dtos
{
    public class WorkoutRequestDtos
    {
        public int UserId { get; set; }
        public int WorkoutId { get; set; }
        public int Age { get; set; }
        public double BMI { get; set; }
        public string Gender { get; set; }
        public string DietaryPreferences { get; set; }
        public string MedicalHistory { get; set; }
        public DateTime RequestedDate { get; set; }
        public string RequestStatus { get; set; }
    }
}