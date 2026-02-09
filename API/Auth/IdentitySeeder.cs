using Microsoft.AspNetCore.Identity;

namespace ConferenceBooking.API.Auth;

public static class IdentitySeeder
{
    public static async Task SeedAsync(UserManager<ApplicationUser> userManager,
    RoleManager<IdentityRole> roleManager)
    {
        var rolesAndUsers = new[]
        {
            new { Role = "Admin", UserName = "AdminUser", Email = "admin@domain.com", Password = "Admin123!" },
            new { Role = "Receptionist", UserName = "ReceptionistUser", Email = "receptionist@domain.com", Password = "Receptionist123!" },
            new { Role = "Employee", UserName = "EmployeeUser", Email = "employee@domain.com", Password = "Employee123!" },
            new { Role = "FacilityManager", UserName = "FacilityManagerUser", Email = "facilitymanager@domain.com", Password = "FacilityManager123!" }
        };

        foreach (var entry in rolesAndUsers)
        {
            if (!await roleManager.RoleExistsAsync(entry.Role))
            {
                await roleManager.CreateAsync(new IdentityRole(entry.Role));
            }

            var user = await userManager.FindByNameAsync(entry.UserName);

            if (user == null)
            {
                user = new ApplicationUser
                {
                    UserName = entry.UserName,
                    Email = entry.Email
                };

                await userManager.CreateAsync(user, entry.Password);
                await userManager.AddToRoleAsync(user, entry.Role);
            }
        }
    }
}