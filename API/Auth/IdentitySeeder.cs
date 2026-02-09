using Microsoft.AspNetCore.Identity;

public static class IdentitySeeder
{
    public static async Task SeedAsync(UserManager<ApplicationUser> userManager,
    RoleManager<IdentityRole> roleManager)
    {
        // Ensure roles exist
        var roles = new[] { "Admin", "Employee", "FacilityManager", "Receptionist" };
        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole(role));
            }
        }

        // Seed Admin user
        var admin = await userManager.FindByNameAsync("AdminUser");
        if (admin == null)
        {
            admin = new ApplicationUser
            {
                UserName = "AdminUser",
                Email = "admin@example.com"
            };
            await userManager.CreateAsync(admin, "Admin123!");
            await userManager.AddToRoleAsync(admin, "Admin");
        }

        // Seed Employee user
        var employee = await userManager.FindByNameAsync("EmployeeUser");
        if (employee == null)
        {
            employee = new ApplicationUser
            {
                UserName = "EmployeeUser",
                Email = "employee@example.com"
            };
            await userManager.CreateAsync(employee, "Employee123!");
            await userManager.AddToRoleAsync(employee, "Employee");
        }

        // Seed Facility Manager user
        var facilityManager = await userManager.FindByNameAsync("FacilityManagerUser");
        if (facilityManager == null)
        {
            facilityManager = new ApplicationUser
            {
                UserName = "FacilityManagerUser",
                Email = "facilitymanager@example.com"
            };
            await userManager.CreateAsync(facilityManager, "Facility123!");
            await userManager.AddToRoleAsync(facilityManager, "FacilityManager");
        }

        // Seed Receptionist user
        var receptionist = await userManager.FindByNameAsync("ReceptionistUser");
        if (receptionist == null)
        {
            receptionist = new ApplicationUser
            {
                UserName = "ReceptionistUser",
                Email = "receptionist@example.com"
            };
            await userManager.CreateAsync(receptionist, "Reception123!");
            await userManager.AddToRoleAsync(receptionist, "Receptionist");
        }
    }
}