using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using dotnetapp.Dtos;
using dotnetapp.Models;
using dotnetapp.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace dotnetapp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SymptomHistoryController : ControllerBase
    {
        private readonly SymptomHistoryService _service;
        private readonly IMapper _mapper;
        private readonly ILogger<SymptomHistoryController> _logger;

        public SymptomHistoryController(
            SymptomHistoryService service,
            IMapper mapper,
            ILogger<SymptomHistoryController> logger)
        {
            _service = service;
            _mapper = mapper;
            _logger = logger;
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<SymptomHistory>>> GetAll()
        {
            try
            {
                var histories = await _service.GetAllSymptomHistories();
                return Ok(histories);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching all symptom histories");
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpGet("user/{userId}")]
        [Authorize(Roles = "User, Admin")]
        public async Task<ActionResult<IEnumerable<SymptomHistory>>> GetByUserId(int userId)
        {
            try
            {
                var histories = await _service.GetSymptomHistoriesByUserId(userId);
                return Ok(histories);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching symptom histories for user {UserId}", userId);
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpPost]
        [Authorize(Roles = "User, Admin")]
        public async Task<ActionResult> Add([FromBody] SymptomHistoryDto dto)
        {
            try
            {
                var history = _mapper.Map<SymptomHistory>(dto);
                var success = await _service.AddSymptomHistory(history);
                if (!success)
                {
                    return BadRequest(new { message = "Failed to record symptom history" });
                }
                return Ok(new { message = "Symptom history saved successfully", id = history.Id });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding symptom history");
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "User, Admin")]
        public async Task<ActionResult> Delete(int id)
        {
            try
            {
                var success = await _service.DeleteSymptomHistory(id);
                if (!success)
                {
                    return NotFound(new { message = "Symptom history record not found" });
                }
                return Ok(new { message = "Symptom history deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting symptom history {Id}", id);
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }
    }
}
