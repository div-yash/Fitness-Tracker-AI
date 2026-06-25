using dotnetapp.Data;
using dotnetapp.Models;
using dotnetapp.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace dotnetapp.Controllers
{
    [ApiController]
    [Route("api")]
    public class AuthenticationController : ControllerBase
    {
        private readonly ILogger<AuthenticationController> _logger;
        private readonly IAuthService _authService;
        private readonly ApplicationDbContext _context;
        private readonly RoleManager<IdentityRole> _roleManager;

        public AuthenticationController(ILogger<AuthenticationController> logger, IAuthService authService, RoleManager<IdentityRole> roleManager)
        {
            _logger = logger;
            _authService = authService;
            _roleManager = roleManager;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    _logger.LogError($"Bad Request.");
                    return BadRequest(new
                    {
                        success = false,
                        message = "Invalid payload"
                    });
                }

                var (status, token) = await _authService.Login(model);

                if (status == 0)
                {
                    _logger.LogError($"Unauthorized user trying to Login.");
                    return Unauthorized(new
                    {
                        success = false,
                        message = token
                    });
                }

                _logger.LogInformation("Logged In Successfully!");
                return Ok(new
                {
                    success = true,
                    message = "Login successfull",
                    token = token,
                    tokenType = "Bearer"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Login error");
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    _logger.LogError($"Bad Request");
                    return BadRequest(new { message = "Invalid payload" });
                }


                var allowedRoles = new[] { "Admin", "User" };
                if (!allowedRoles.Contains(model.UserRole))
                {
                    _logger.LogError($"Bad Request");
                    return BadRequest(new
                    {
                        message = "Invalid role. Role must be one of: Admin, User"
                    });
                }

                var (statusCode, message) = await _authService.Registration(model, model.UserRole);

                if (statusCode == 0)
                {
                    _logger.LogError($"Bad Request: {message}");
                    return BadRequest(new { message });
                }

                _logger.LogInformation("Logged In Successfully!");
                return Ok(new { message = "User registered successfully", role = model.UserRole });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Register error");
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Internal server error" });
            }
        }
    }
}
