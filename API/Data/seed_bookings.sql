-- Seed realistic bookings for Conference Booking System
-- Run this script AFTER running migrations and seeding users
-- Requirement: Minimum of 5 realistic bookings with varying statuses

-- Note: This script assumes users have been seeded via IdentitySeeder
-- User IDs will need to be retrieved from AspNetUsers table

DO $$
DECLARE
    admin_id TEXT;
    admin_name TEXT;
    employee_id TEXT;
    employee_name TEXT;
    receptionist_id TEXT;
    receptionist_name TEXT;
    room1_id INT; room1_loc INT; room1_cap INT;
    room2_id INT; room2_loc INT; room2_cap INT;
    room3_id INT; room3_loc INT; room3_cap INT;
    room4_id INT; room4_loc INT; room4_cap INT;
    room5_id INT; room5_loc INT; room5_cap INT;
BEGIN
    -- Get user IDs from seeded data
    SELECT "Id", "UserName" INTO admin_id, admin_name FROM "AspNetUsers" WHERE "Email" = 'admin@domain.com' LIMIT 1;
    SELECT "Id", "UserName" INTO employee_id, employee_name FROM "AspNetUsers" WHERE "Email" = 'employee@domain.com' LIMIT 1;
    SELECT "Id", "UserName" INTO receptionist_id, receptionist_name FROM "AspNetUsers" WHERE "Email" = 'receptionist@domain.com' LIMIT 1;

    -- Get room IDs + Location + Capacity (first 5 active rooms)
    SELECT "Id","Location","Capacity" INTO room1_id,room1_loc,room1_cap FROM "ConferenceRooms" WHERE "IsActive" = true ORDER BY "Id" LIMIT 1 OFFSET 0;
    SELECT "Id","Location","Capacity" INTO room2_id,room2_loc,room2_cap FROM "ConferenceRooms" WHERE "IsActive" = true ORDER BY "Id" LIMIT 1 OFFSET 1;
    SELECT "Id","Location","Capacity" INTO room3_id,room3_loc,room3_cap FROM "ConferenceRooms" WHERE "IsActive" = true ORDER BY "Id" LIMIT 1 OFFSET 2;
    SELECT "Id","Location","Capacity" INTO room4_id,room4_loc,room4_cap FROM "ConferenceRooms" WHERE "IsActive" = true ORDER BY "Id" LIMIT 1 OFFSET 3;
    SELECT "Id","Location","Capacity" INTO room5_id,room5_loc,room5_cap FROM "ConferenceRooms" WHERE "IsActive" = true ORDER BY "Id" LIMIT 1 OFFSET 4;

    -- Only seed if bookings table is empty
    IF NOT EXISTS (SELECT 1 FROM "Bookings" LIMIT 1) THEN

        -- Booking 1: Confirmed - Today morning slot
        INSERT INTO "Bookings" ("RoomId","UserId","RequestedBy","StartTime","EndTime","Status","CreatedAt","Location","Capacity")
        VALUES (room1_id, employee_id, COALESCE(employee_name,'employee@domain.com'),
            CURRENT_DATE + INTERVAL '9 hours', CURRENT_DATE + INTERVAL '11 hours',
            1, NOW() - INTERVAL '2 days', room1_loc, room1_cap);

        -- Booking 2: Pending - Tomorrow afternoon
        INSERT INTO "Bookings" ("RoomId","UserId","RequestedBy","StartTime","EndTime","Status","CreatedAt","Location","Capacity")
        VALUES (room2_id, admin_id, COALESCE(admin_name,'admin@domain.com'),
            CURRENT_DATE + INTERVAL '1 day' + INTERVAL '14 hours',
            CURRENT_DATE + INTERVAL '1 day' + INTERVAL '16 hours',
            0, NOW() - INTERVAL '3 hours', room2_loc, room2_cap);

        -- Booking 3: Confirmed - Next week
        INSERT INTO "Bookings" ("RoomId","UserId","RequestedBy","StartTime","EndTime","Status","CreatedAt","Location","Capacity")
        VALUES (room3_id, COALESCE(receptionist_id, employee_id),
            COALESCE(receptionist_name, employee_name, 'receptionist@domain.com'),
            CURRENT_DATE + INTERVAL '7 days' + INTERVAL '10 hours',
            CURRENT_DATE + INTERVAL '7 days' + INTERVAL '12 hours',
            1, NOW() - INTERVAL '5 days', room3_loc, room3_cap);

        -- Booking 4: Cancelled - Past date
        INSERT INTO "Bookings" ("RoomId","UserId","RequestedBy","StartTime","EndTime","Status","CreatedAt","CancelledAt","Location","Capacity")
        VALUES (room4_id, admin_id, COALESCE(admin_name,'admin@domain.com'),
            CURRENT_DATE - INTERVAL '3 days' + INTERVAL '9 hours',
            CURRENT_DATE - INTERVAL '3 days' + INTERVAL '11 hours',
            2, NOW() - INTERVAL '10 days', NOW() - INTERVAL '4 days', room4_loc, room4_cap);

        -- Booking 5: Pending - This afternoon or tomorrow
        INSERT INTO "Bookings" ("RoomId","UserId","RequestedBy","StartTime","EndTime","Status","CreatedAt","Location","Capacity")
        VALUES (room5_id, employee_id, COALESCE(employee_name,'employee@domain.com'),
            CASE WHEN EXTRACT(HOUR FROM NOW()) < 15
                THEN CURRENT_DATE + INTERVAL '15 hours'
                ELSE CURRENT_DATE + INTERVAL '1 day' + INTERVAL '13 hours' END,
            CASE WHEN EXTRACT(HOUR FROM NOW()) < 15
                THEN CURRENT_DATE + INTERVAL '17 hours'
                ELSE CURRENT_DATE + INTERVAL '1 day' + INTERVAL '15 hours' END,
            0, NOW() - INTERVAL '1 hour', room5_loc, room5_cap);

        -- Booking 6: Confirmed - Two weeks out
        INSERT INTO "Bookings" ("RoomId","UserId","RequestedBy","StartTime","EndTime","Status","CreatedAt","Location","Capacity")
        VALUES (room1_id, admin_id, COALESCE(admin_name,'admin@domain.com'),
            CURRENT_DATE + INTERVAL '14 days' + INTERVAL '9 hours',
            CURRENT_DATE + INTERVAL '14 days' + INTERVAL '10 hours 30 minutes',
            1, NOW() - INTERVAL '1 day', room1_loc, room1_cap);

        RAISE NOTICE 'Successfully seeded 6 realistic bookings';
    ELSE
        RAISE NOTICE 'Bookings already exist, skipping seed';
    END IF;
END $$;

