using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using API.DTO;
using ConferenceBooking.API.Auth;

namespace API.Controllers
{
    [ApiController]
    [Route("api/auth")]
    [Authorize] // Protect all endpoints in this controller
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly TokenService _tokenService;

        public AuthController(
            UserManager<ApplicationUser> userManager,
            TokenService tokenService)
        {
            _userManager = userManager;
            _tokenService = tokenService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            if (string.IsNullOrEmpty(dto.Username))
            {
                return BadRequest("Username cannot be null or empty.");
            }

            if (string.IsNullOrEmpty(dto.Password))
            {
                return BadRequest("Password cannot be null or empty.");
            }

            var user = await _userManager.FindByNameAsync(dto.Username);

            if (user == null || 
                !await _userManager.CheckPasswordAsync(user, dto.Password))
            {
                return Unauthorized();
            }

            var roles = await _userManager.GetRolesAsync(user);

            var token = _tokenService.GenerateToken(user, roles);

            return Ok(new { token });
        }
    }
}
