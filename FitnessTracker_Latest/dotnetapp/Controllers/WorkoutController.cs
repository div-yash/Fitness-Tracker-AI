using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using dotnetapp.Data;
using dotnetapp.Models;
using dotnetapp.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace dotnetapp.Controllers
{
    [ApiController]
    [Route("api/workout")]
    public class WorkoutController : ControllerBase
    {
        private readonly ILogger<WorkoutController> _logger;
        private readonly WorkoutService _workoutService;
        public WorkoutController(WorkoutService workoutService, ILogger<WorkoutController> logger)
        {
            _logger = logger;
            _workoutService = workoutService;
        }

        [HttpGet]
        [Authorize(Roles = "Admin, User")]
        public async Task<ActionResult<IEnumerable<Workout>>> GetAllWorkouts()
        {
            try
            {
                var workouts = await _workoutService.GetAllWorkouts();
                _logger.LogInformation("Ok. Workouts found.");
                return Ok(workouts);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching all workouts");
                return StatusCode(StatusCodes.Status500InternalServerError, $"{ex.Message}");
            }
        }

        [HttpGet("{workoutId}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Workout>> GetWorkoutById(int workoutId)
        {
            try
            {
                var workouts = await _workoutService.GetWorkoutById(workoutId);
                if (workouts == null)
                {
                    _logger.LogWarning("Not Found. Workout with id not found.");
                    return NotFound(new{message = "No workouts found."});
                }
                _logger.LogInformation("Ok. Workout with id found.");
                return Ok(workouts);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in fetching data by id.");
                return StatusCode(StatusCodes.Status500InternalServerError, $"{ex.Message}");
            }
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> AddWorkout([FromBody] Workout workout)
        {
            try
            {
                var workouts = await _workoutService.AddWorkout(workout);
                if (!workouts)
                {
                    _logger.LogError("Error in adding");
                    return BadRequest(new{message = "Failed to add workout"});
                }
                _logger.LogInformation("Ok. Workout added successfully!");
                return Ok(workout);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in adding");
                return StatusCode(StatusCodes.Status500InternalServerError, $"{ex.Message}");
            }
        }

        [HttpPut("{workoutId}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> UpdateWorkout(int workoutId, [FromBody] Workout workout)
        {
            try
            {
                var workouts = await _workoutService.UpdateWorkout(workoutId, workout);
                if (!workouts)
                {
                    _logger.LogWarning("Not Found. Workout with id not found.");
                    return BadRequest(new{message="Workout not found"});
                }
                _logger.LogInformation("Workout Updated Successfully!");
                return Ok(new{message = "Workout updated successfully"});
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in update");
                return StatusCode(StatusCodes.Status500InternalServerError, $"{ex.Message}");
            }
        }

        [HttpDelete("{workoutId}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> DeleteWorkout(int workoutId)
        {
            try
            {
                var workout = await _workoutService.DeleteWorkout(workoutId);
                if (!workout)
                {
                    _logger.LogWarning("Not Found. Workout with id not found.");
                    return NotFound(new{message="Cannot find workout"});
                }
                _logger.LogInformation("Ok. Workout Deleted Successfully!");
                return Ok(new{message="Workout deleted successfully"});
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in deleting");
                return StatusCode(StatusCodes.Status500InternalServerError, $"{ex.Message}");
            }
        }
    }
}

