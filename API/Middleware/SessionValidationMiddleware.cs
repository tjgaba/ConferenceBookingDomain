using Microsoft.AspNetCore.Http;
using System.Linq;
using System.Threading.Tasks;
using ConferenceBooking.API.Services;

namespace ConferenceBooking.API.Middleware
{
    /// <summary>
    /// Middleware to validate JWT tokens against active sessions in the database.
    /// This ensures that revoked sessions cannot access protected endpoints.
    /// </summary>
    public class SessionValidationMiddleware
    {
        private readonly RequestDelegate _next;

        public SessionValidationMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context, ISessionManager sessionManager)
        {
            // Skip validation for authentication endpoints and public endpoints
            var path = context.Request.Path.Value?.ToLower() ?? "";
            if (path.StartsWith("/api/auth/login") || 
                path.StartsWith("/api/auth/register") ||
                !context.User.Identity?.IsAuthenticated == true)
            {
                await _next(context);
                return;
            }

            // Extract token from Authorization header
            var authHeader = context.Request.Headers["Authorization"].FirstOrDefault();
            if (authHeader != null && authHeader.StartsWith("Bearer "))
            {
                var token = authHeader.Substring("Bearer ".Length).Trim();

                // Validate session in database
                var session = await sessionManager.GetSessionByTokenAsync(token);
                
                if (session == null || !session.IsActive())
                {
                    context.Response.StatusCode = 401;
                    context.Response.ContentType = "application/json";
                    await context.Response.WriteAsync("{\"error\":\"Session has been revoked or expired\"}");
                    return;
                }

                // Update last activity timestamp
                await sessionManager.UpdateSessionActivityAsync(token);
            }

            await _next(context);
        }
    }
}
