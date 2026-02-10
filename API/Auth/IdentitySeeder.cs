using Microsoft.AspNetCore.Identity;
using ConferenceBooking.API.Auth;

public static class IdentitySeeder
{
    public static async Task SeedAsync(UserManager<ApplicationUser> userManager,
    RoleManager<IdentityRole> roleManager)
    {
        try
        {
            if (!await roleManager.RoleExistsAsync("Admin"))
            {
                await roleManager.CreateAsync(new IdentityRole("Admin"));
            }
            var admin = await userManager.FindByNameAsync("Admin");

            if (admin == null)
            {
                admin = new ApplicationUser
                {
                    UserName = "Admin",
                    Email = "admin@domain.com"
                };

                var result = await userManager.CreateAsync(admin, "Admin123!");
                if (!result.Succeeded)
                {
                    throw new Exception("Failed to create Admin user: " + string.Join(", ", result.Errors.Select(e => e.Description)));
                }
                await userManager.AddToRoleAsync(admin, "Admin");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error during seeding: {ex.Message}");
            throw;
        }

        if (!await roleManager.RoleExistsAsync("Receptionist"))
        {
            await roleManager.CreateAsync(new IdentityRole("Receptionist"));
        }
        var receptionist = await userManager.FindByNameAsync("ReceptionistUser");

        if (receptionist == null)
        {
            receptionist = new ApplicationUser
            {
                UserName = "ReceptionistUser",
                Email = "receptionist@domain.com"
            };

            await userManager.CreateAsync(receptionist, "Receptionist123!");
            await userManager.AddToRoleAsync(receptionist, "Receptionist");
        }

        if (!await roleManager.RoleExistsAsync("FacilityManager"))
        {
            await roleManager.CreateAsync(new IdentityRole("FacilityManager"));
        }
        var facilityManager = await userManager.FindByNameAsync("FacilityManagerUser");

        if (facilityManager == null)
        {
            facilityManager = new ApplicationUser
            {
                UserName = "FacilityManagerUser",
                Email = "facilitymanager@domain.com"
            };

            await userManager.CreateAsync(facilityManager, "FacilityManager123!");
            await userManager.AddToRoleAsync(facilityManager, "FacilityManager");
        }

        if (!await roleManager.RoleExistsAsync("Employee"))
        {
            await roleManager.CreateAsync(new IdentityRole("Employee"));
        }
        var employee = await userManager.FindByNameAsync("EmployeeUser");

        if (employee == null)
        {
            employee = new ApplicationUser
            {
                UserName = "EmployeeUser",
                Email = "employee@domain.com"
            };

            await userManager.CreateAsync(employee, "Employee123!");
            await userManager.AddToRoleAsync(employee, "Employee");
        }
    }
}