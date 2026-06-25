using Microsoft.AspNetCore.Mvc;
using dotnetapp.Models;
using dotnetapp.Services;
using Microsoft.AspNetCore.Authorization;
using AutoMapper;
using dotnetapp.Dtos;
using Microsoft.Extensions.Logging;

namespace dotnetapp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FeedbackController : ControllerBase
    {
        private readonly FeedbackService _feedbackService;
        private readonly IMapper _mapper;
        private readonly ILogger<FeedbackController> _logger;

        public FeedbackController(
            FeedbackService feedbackService, 
            IMapper mapper,
            ILogger<FeedbackController> logger)
        {
            _feedbackService=feedbackService;
            _mapper=mapper;
            _logger=logger;
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<Feedback>>> GetAllFeedbacks(){
            _logger.LogInformation("Admin is requested for all Feedbacks");

            try{
                var feedbacks=await _feedbackService.GetAllFeedbacks();
                _logger.LogInformation("Admin successfully fetched {count} Feedbacks", feedbacks.Count());
                return Ok(feedbacks);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while fetching feedbacks");
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }

        }

        [HttpGet("user/{userId}")]
        [Authorize(Roles = "User")]
        public async Task<ActionResult<IEnumerable<Feedback>>> GetFeedbacksByUserId(int userId){
            _logger.LogInformation("User is requested for feedbacks by Id");
            try{
                var feedbacks= await _feedbackService.GetFeedbacksByUserId(userId);
                if(!feedbacks.Any())
                {
                    _logger.LogWarning("User {UserId} has failed to fetch feedback", userId);
                    return NotFound(new{message="No feedbacks found for this user"});
                }
                _logger.LogInformation("User {UserId} has successfully fetched feedback",userId);
                return Ok(feedbacks);
            }
            catch (Exception ex){
                _logger.LogError(ex, "Error while fetching feedback");
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost]
        [Authorize(Roles ="User")]
        public async Task<ActionResult> AddFeedback([FromBody] FeedbackDtos feedbackDto)
        {
            _logger.LogInformation("User is requesting to add feedback");
            try{
                var feedback=_mapper.Map<Feedback>(feedbackDto);
                var result=await _feedbackService.AddFeedback(feedback);
                if(result){
                    _logger.LogInformation("User {UserId} is adding feedback", feedbackDto.UserId);
                    return Ok(new {message = "Feedback added successfully"});
                }
                _logger.LogWarning("User {UserId} is failed to add feedback", feedbackDto.UserId);
                return BadRequest(new{message="Failed"});
            }
            catch(Exception ex){
                _logger.LogError(ex, "Error while adding feedback");
                return StatusCode(500, ex.Message);
            }
        }

        [HttpDelete("{feedbackId}")]
        [Authorize(Roles ="User")]

        public async Task<ActionResult> DeleteFeedback(int feedbackId)
        {
            _logger.LogInformation("User is requested to delete feedback");
            try{
                var result=await _feedbackService.DeleteFeedback(feedbackId);
                if(!result){
                    _logger.LogInformation("Couldn't able to delete Feedback {FeedbackId} ", feedbackId);
                    return NotFound(new{message="Cannot find feedback"});
                }         
                _logger.LogInformation("{feedbackId} is deleted  successfully",feedbackId);
                return Ok(new{message="Feedback deleted successfully"});
            }
            catch(Exception ex){
                _logger.LogError(ex, "Error while fetching feedbacks");
                return StatusCode(500, ex.Message);
            }
        }
    }
}
