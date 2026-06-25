using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace dotnetapp.Exceptions
{
    public class WorkoutNotFoundException :Exception
    {
        public WorkoutNotFoundException(int id):base($"Workout with Id {id} not found."){
            
        }
        
    }
}