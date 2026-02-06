using Microsoft.AspNetCore.Http;
using System;
using System.Net;
using System.Threading.Tasks;

namespace ConferenceBooking.API.Middleware
{
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;

        public ExceptionHandlingMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex);
            }
        }

        private static Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";

            // Log the exception details for internal tracking.
            // This logs the exception type, message, and timestamp to the console.
            // It helps developers debug issues without exposing sensitive details to the client.
            Console.WriteLine($"[ERROR] {DateTime.UtcNow}: {exception.GetType().Name} - {exception.Message}");

            // Map domain-specific exceptions to HTTP status codes.
            if (exception is BookingNotFoundException)
            {
                context.Response.StatusCode = (int)HttpStatusCode.NotFound;
            }
            else if (exception is BookingConflictException)
            {
                context.Response.StatusCode = (int)HttpStatusCode.Conflict;
            }
            else
            {
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            }

            var errorResponse = new
            {
                success = false,
                error = new
                {
                    message = "An unexpected error occurred.",
                    details = exception.Message,
                    statusCode = context.Response.StatusCode
                }
            };

            return context.Response.WriteAsJsonAsync(errorResponse);

            // This code intercepts unhandled exceptions and formats them into a standard JSON response.
            // The response includes:
            // - success: Indicates the operation failed (false).
            // - error: An object containing the error message, details, and HTTP status code.
            // This ensures all endpoints return errors in a predictable structure.
        }

        // Map domain-specific exceptions to HTTP status codes.
        private static void MapExceptionToStatusCode(Exception exception, out int statusCode)
        {
            if (exception is BookingNotFoundException)
            {
                statusCode = (int)HttpStatusCode.NotFound;
            }
            else if (exception is BookingConflictException)
            {
                statusCode = (int)HttpStatusCode.Conflict;
            }
            else
            {
                statusCode = (int)HttpStatusCode.InternalServerError;
            }
        }
    }
}