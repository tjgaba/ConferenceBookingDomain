using Microsoft.AspNetCore.Identity;
using ConferenceBooking.API.Auth;
using ConferenceBooking.API.Entities;

public static class IdentitySeeder
{
    public static async Task SeedAsync(UserManager<ApplicationUser> userManager,
    RoleManager<IdentityRole> roleManager)
    {
        try
        {
            // Seed Admin role and user
            if (!await roleManager.RoleExistsAsync("Admin"))
            {
                await roleManager.CreateAsync(new IdentityRole("Admin"));
            }
            var admin = await userManager.FindByNameAsync("admin@domain.com");

            if (admin == null)
            {
                admin = new ApplicationUser
                {
                    UserName = "admin@domain.com",
                    Email = "admin@domain.com",
                    EmailConfirmed = true,
                    FirstName = "System",
                    LastName = "Administrator",
                    Department = "IT",
                    EmployeeNumber = "EMP001",
                    PrimaryLocation = RoomLocation.London,
                    PreferredLocation = RoomLocation.London,
                    NotificationPreferences = "Email",
                    IsActive = true,
                    DateJoined = DateTime.UtcNow,
                    CreatedAt = DateTime.UtcNow
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
            Console.WriteLine($"Error during Admin seeding: {ex.Message}");
            throw;
        }

        // Seed Receptionist role and user
        if (!await roleManager.RoleExistsAsync("Receptionist"))
        {
            await roleManager.CreateAsync(new IdentityRole("Receptionist"));
        }
        var receptionist = await userManager.FindByNameAsync("receptionist@domain.com");

        if (receptionist == null)
        {
            receptionist = new ApplicationUser
            {
                UserName = "receptionist@domain.com",
                Email = "receptionist@domain.com",
                EmailConfirmed = true,
                FirstName = "Sarah",
                LastName = "Johnson",
                Department = "Reception",
                EmployeeNumber = "EMP002",
                PrimaryLocation = RoomLocation.London,
                PreferredLocation = RoomLocation.London,
                NotificationPreferences = "Email",
                IsActive = true,
                DateJoined = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow
            };

            await userManager.CreateAsync(receptionist, "Receptionist123!");
            await userManager.AddToRoleAsync(receptionist, "Receptionist");
        }

        // Seed FacilityManager role and user
        if (!await roleManager.RoleExistsAsync("FacilityManager"))
        {
            await roleManager.CreateAsync(new IdentityRole("FacilityManager"));
        }
        var facilityManager = await userManager.FindByNameAsync("facilitymanager@domain.com");

        if (facilityManager == null)
        {
            facilityManager = new ApplicationUser
            {
                UserName = "facilitymanager@domain.com",
                Email = "facilitymanager@domain.com",
                EmailConfirmed = true,
                FirstName = "Michael",
                LastName = "Smith",
                Department = "Facilities",
                EmployeeNumber = "EMP003",
                PrimaryLocation = RoomLocation.CapeTown,
                PreferredLocation = RoomLocation.CapeTown,
                NotificationPreferences = "Both",
                IsActive = true,
                DateJoined = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow
            };

            await userManager.CreateAsync(facilityManager, "FacilityManager123!");
            await userManager.AddToRoleAsync(facilityManager, "FacilityManager");
        }

        // Seed Employee role and user
        if (!await roleManager.RoleExistsAsync("Employee"))
        {
            await roleManager.CreateAsync(new IdentityRole("Employee"));
        }
        var employee = await userManager.FindByNameAsync("employee@domain.com");

        if (employee == null)
        {
            employee = new ApplicationUser
            {
                UserName = "employee@domain.com",
                Email = "employee@domain.com",
                EmailConfirmed = true,
                FirstName = "John",
                LastName = "Doe",
                Department = "Sales",
                EmployeeNumber = "EMP004",
                PrimaryLocation = RoomLocation.Johannesburg,
                PreferredLocation = RoomLocation.Johannesburg,
                NotificationPreferences = "Email",
                IsActive = true,
                DateJoined = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow
            };

            await userManager.CreateAsync(employee, "Employee123!");
            await userManager.AddToRoleAsync(employee, "Employee");
        }
        
        // Seed an inactive employee for testing soft delete
        var inactiveEmployee = await userManager.FindByNameAsync("inactive@domain.com");

        if (inactiveEmployee == null)
        {
            inactiveEmployee = new ApplicationUser
            {
                UserName = "inactive@domain.com",
                Email = "inactive@domain.com",
                EmailConfirmed = true,
                FirstName = "Jane",
                LastName = "Inactive",
                Department = "Marketing",
                EmployeeNumber = "EMP005",
                PrimaryLocation = RoomLocation.Durban,
                PreferredLocation = RoomLocation.Durban,
                NotificationPreferences = "Email",
                IsActive = false,
                DateJoined = DateTime.UtcNow.AddMonths(-6),
                CreatedAt = DateTime.UtcNow.AddMonths(-6),
                DeletedAt = DateTime.UtcNow.AddDays(-30)
            };

            await userManager.CreateAsync(inactiveEmployee, "Inactive123!");
            await userManager.AddToRoleAsync(inactiveEmployee, "Employee");
        }
    }
}
