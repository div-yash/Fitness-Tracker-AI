using System.Configuration;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using dotnetapp.Data;
using dotnetapp.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace dotnetapp.Services
{
    public class AuthService : IAuthService
    {
        private readonly string JWT_KEY = "bdndfnbfjknvdfvjnvnsdkjnsdclnsdcbcsdcbsj";
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> userManager;
        private readonly RoleManager<IdentityRole> roleManager;
        private readonly IConfiguration _configuration;
        private readonly IPasswordHasher<ApplicationUser> _passwordHasher;
        public AuthService(ApplicationDbContext context,IConfiguration configuration, UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, IPasswordHasher<ApplicationUser> passwordHasher)
        {
            this.userManager = userManager;
            this.roleManager = roleManager;
            _context = context;
            _configuration = configuration;
            _passwordHasher = passwordHasher;
        }

        public async Task<(int, string)> Registration(User model, string role)
        {
            var existingUser = await userManager.FindByEmailAsync(model.Email);
            if (existingUser != null)
            {
                return (0, "User already exists");
            }

            const int NAME_MAX = 30;
            var safeName = model.Username;
            if (!string.IsNullOrEmpty(safeName) && safeName.Length > NAME_MAX)
                safeName = safeName.Substring(0, NAME_MAX);

            var user = new ApplicationUser
            {
                UserName = model.Email,
                Name = safeName,
                Email = model.Email,
                PhoneNumber = model.MobileNumber
            };

            var hashPassword = _passwordHasher.HashPassword(user, model.Password);

            var domainUser = new User
            {
                Email = user.Email,
                Username = safeName,
                Password = hashPassword,
                MobileNumber = model.MobileNumber,
                UserRole = role,
            };

            _context.Users.Add(domainUser);
            await _context.SaveChangesAsync();

            var result = await userManager.CreateAsync(user, model.Password);
            if (!result.Succeeded)
            {
                return (0, "User creation failed! Please check user details and try again.");
            }

            var addToRoleResult = await userManager.AddToRoleAsync(user, role);
            if (!addToRoleResult.Succeeded)
            {
                return (0, "User created but assigning role failed.");
            }

            return (1, "User created successfully!");
        }

        public async Task<(int, string)> Login(LoginModel model)
        {
            var user = await userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                return (0, "User not found");
            }

            var isPasswordValid = await userManager.CheckPasswordAsync(user, model.Password);
            if (!isPasswordValid)
            {
                return (0, "Password incorrect");
            }

            var roles = await userManager.GetRolesAsync(user);
            var appUser = await _context.Users.FirstOrDefaultAsync(u=>u.Email==model.Email);
 
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Email, user.Email ?? ""),
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Name, user.Name ?? ""),
                new Claim("UserId", appUser?.UserId.ToString() ?? "0")
            };
            claims.AddRange(roles.Select(r => new Claim(ClaimTypes.Role, r)));

            var token = GenerateToken(claims);

            return (1, token);
        }



         private string GenerateToken(IEnumerable<Claim> claims)
        {
            var issuer = _configuration["Jwt:Issuer"];
            var audience = _configuration["Jwt:Audience"];
            var expiresStr = _configuration["Jwt:ExpiresMinutes"] ?? "60";
            var expiresMinutes = int.TryParse(expiresStr, out var minutes) ? minutes : 60;
 
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(JWT_KEY));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
 
            var token = new JwtSecurityToken(
                claims: claims,
                issuer: issuer,
                audience: audience,
                expires: DateTime.UtcNow.AddMinutes(expiresMinutes),
                signingCredentials: creds
            );
 
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}