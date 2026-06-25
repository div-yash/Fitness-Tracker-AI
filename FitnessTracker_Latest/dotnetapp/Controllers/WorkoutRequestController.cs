using Microsoft.AspNetCore.Mvc;
using dotnetapp.Models;
using dotnetapp.Services;
using Microsoft.AspNetCore.Authorization;
using AutoMapper;
using dotnetapp.Dtos;

namespace dotnetapp.Controllers
{
    [ApiController]
    [Route("api/workoutrequests")]
    public class WorkoutRequestController : ControllerBase
    { 
        private readonly WorkoutRequestService _workoutRequestService;
        private readonly IMapper _mapper;
        public WorkoutRequestController(WorkoutRequestService workoutRequestService, IMapper mapper)
        {
            _workoutRequestService = workoutRequestService;
             _mapper=mapper;
        }
        
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<WorkoutRequest>>> GetAllWorkoutRequests()
        {
            try
            {
                var requests = await _workoutRequestService.GetAllWorkoutRequests();
                return Ok(requests);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("user/{userId}")]
        [Authorize(Roles = "User")]
        public async Task<ActionResult<IEnumerable<WorkoutRequest>>> GetWorkoutRequestsByUserId(int userId)
        {
            try
            {
                var requests = await _workoutRequestService.GetWorkoutRequestsByUserId(userId);
                if (requests == null || !requests.Any())
                    return NotFound(new{message=$"No workout requests found for user ID {userId}"});
                return Ok(requests);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost]
        [Authorize(Roles = "User")]
        public async Task<ActionResult> AddWorkoutRequest([FromBody] WorkoutRequestDtos workoutRequestdto)
        {
            try
            {
                var workout= _mapper.Map<WorkoutRequest>(workoutRequestdto);
                var workoutreq=await _workoutRequestService.AddWorkoutRequest(workout);
                if (!workoutreq)
                    return BadRequest(new{message="Workout request not found"});
                return Ok(new{message="Workout Request added successfully"});
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPut("{workoutRequestId}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> UpdateWorkoutRequest(int workoutRequestId, [FromBody] WorkoutRequestDtos workoutRequestdto)
        {
            try
            {
               var workout= _mapper.Map<WorkoutRequest>(workoutRequestdto);
                var workoutreq=await _workoutRequestService.UpdateWorkoutRequest(workoutRequestId,workout);
                if (!workoutreq)
                    return BadRequest(new{message="Workout request not found"});
                return Ok(new{message="Workout Request updated successfully"});
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);

            }
        }

        [HttpDelete("{workoutRequestId}")]
        [Authorize(Roles = "User")]
        public async Task<ActionResult> DeleteWorkoutRequest(int workoutRequestId)
        {
            try
            {
                var success = await _workoutRequestService.DeleteWorkoutRequest(workoutRequestId);
                if (!success)
                    return NotFound(new{message="Cannot find any workout request"});
                return Ok(new{message = "Workout Request deleted successfully"});

            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

    }
}