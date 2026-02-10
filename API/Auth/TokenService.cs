using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace ConferenceBooking.API.Auth;

public class TokenService
{
    private readonly IConfiguration _config;

    public TokenService(IConfiguration config)
    {
        _config = config;
    }

    public string GenerateToken(ApplicationUser user, IList<string> roles)
    {
        // Add null check for user.UserName
        var userName = user.UserName ?? throw new InvalidOperationException("UserName cannot be null.");

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, userName)
        };

        claims.AddRange(roles.Select(r => new Claim(ClaimTypes.Role, r)));

        // Add null checks for configuration values
        var key = _config["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key is not configured.");
        var issuer = _config["Jwt:Issuer"] ?? throw new InvalidOperationException("JWT Issuer is not configured.");
        var audience = _config["Jwt:Audience"] ?? throw new InvalidOperationException("JWT Audience is not configured.");

        var symmetricKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
        var creds = new SigningCredentials(symmetricKey, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}