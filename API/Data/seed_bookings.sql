-- Seed realistic bookings for Conference Booking System
-- Run this script AFTER running migrations and seeding users
-- Requirement: Minimum of 5 realistic bookings with varying statuses

-- Note: This script assumes users have been seeded via IdentitySeeder
-- User IDs will need to be retrieved from AspNetUsers table

DO $$
DECLARE
    admin_id TEXT;
    employee_id TEXT;
    receptionist_id TEXT;
    room1_id INT;
    room2_id INT;
    room3_id INT;
    room4_id INT;
    room5_id INT;
BEGIN
    -- Get user IDs from seeded data
    SELECT "Id" INTO admin_id FROM "AspNetUsers" WHERE "Email" = 'admin@domain.com' LIMIT 1;
    SELECT "Id" INTO employee_id FROM "AspNetUsers" WHERE "Email" = 'employee@domain.com' LIMIT 1;
    SELECT "Id" INTO receptionist_id FROM "AspNetUsers" WHERE "Email" = 'receptionist@domain.com' LIMIT 1;
    
    -- Get room IDs (first 5 active rooms)
    SELECT "Id" INTO room1_id FROM "ConferenceRooms" WHERE "IsActive" = true ORDER BY "Id" LIMIT 1 OFFSET 0;
    SELECT "Id" INTO room2_id FROM "ConferenceRooms" WHERE "IsActive" = true ORDER BY "Id" LIMIT 1 OFFSET 1;
    SELECT "Id" INTO room3_id FROM "ConferenceRooms" WHERE "IsActive" = true ORDER BY "Id" LIMIT 1 OFFSET 2;
    SELECT "Id" INTO room4_id FROM "ConferenceRooms" WHERE "IsActive" = true ORDER BY "Id" LIMIT 1 OFFSET 3;
    SELECT "Id" INTO room5_id FROM "ConferenceRooms" WHERE "IsActive" = true ORDER BY "Id" LIMIT 1 OFFSET 4;
    
    -- Only seed if bookings table is empty
    IF NOT EXISTS (SELECT 1 FROM "Bookings" LIMIT 1) THEN
        
        -- Booking 1: Confirmed - Today morning slot
        INSERT INTO "Bookings" ("RoomId", "UserId", "StartTime", "EndTime", "Status", "CreatedAt")
        VALUES (
            room1_id,
            employee_id,
            CURRENT_DATE + INTERVAL '9 hours',
            CURRENT_DATE + INTERVAL '11 hours',
            1, -- Confirmed
            NOW() - INTERVAL '2 days'
        );
        
        -- Booking 2: Pending - Tomorrow afternoon
        INSERT INTO "Bookings" ("RoomId", "UserId", "StartTime", "EndTime", "Status", "CreatedAt")
        VALUES (
            room2_id,
            admin_id,
            CURRENT_DATE + INTERVAL '1 day' + INTERVAL '14 hours',
            CURRENT_DATE + INTERVAL '1 day' + INTERVAL '16 hours',
            0, -- Pending
            NOW() - INTERVAL '3 hours'
        );
        
        -- Booking 3: Confirmed - Next week
        INSERT INTO "Bookings" ("RoomId", "UserId", "StartTime", "EndTime", "Status", "CreatedAt")
        VALUES (
            room3_id,
            COALESCE(receptionist_id, employee_id),
            CURRENT_DATE + INTERVAL '7 days' + INTERVAL '10 hours',
            CURRENT_DATE + INTERVAL '7 days' + INTERVAL '12 hours',
            1, -- Confirmed
            NOW() - INTERVAL '5 days'
        );
        
        -- Booking 4: Cancelled - Past date
        INSERT INTO "Bookings" ("RoomId", "UserId", "StartTime", "EndTime", "Status", "CreatedAt", "CancelledAt")
        VALUES (
            room4_id,
            admin_id,
            CURRENT_DATE - INTERVAL '3 days' + INTERVAL '9 hours',
            CURRENT_DATE - INTERVAL '3 days' + INTERVAL '11 hours',
            2, -- Cancelled
            NOW() - INTERVAL '10 days',
            NOW() - INTERVAL '4 days'
        );
        
        -- Booking 5: Pending - This afternoon or tomorrow
        INSERT INTO "Bookings" ("RoomId", "UserId", "StartTime", "EndTime", "Status", "CreatedAt")
        VALUES (
            room5_id,
            employee_id,
            CASE 
                WHEN EXTRACT(HOUR FROM NOW()) < 15 THEN CURRENT_DATE + INTERVAL '15 hours'
                ELSE CURRENT_DATE + INTERVAL '1 day' + INTERVAL '13 hours'
            END,
            CASE 
                WHEN EXTRACT(HOUR FROM NOW()) < 15 THEN CURRENT_DATE + INTERVAL '17 hours'
                ELSE CURRENT_DATE + INTERVAL '1 day' + INTERVAL '15 hours'
            END,
            0, -- Pending
            NOW() - INTERVAL '1 hour'
        );
        
        -- Booking 6: Confirmed - Two weeks out
        INSERT INTO "Bookings" ("RoomId", "UserId", "StartTime", "EndTime", "Status", "CreatedAt")
        VALUES (
            room1_id,
            admin_id,
            CURRENT_DATE + INTERVAL '14 days' + INTERVAL '9 hours',
            CURRENT_DATE + INTERVAL '14 days' + INTERVAL '10 hours 30 minutes',
            1, -- Confirmed
            NOW() - INTERVAL '1 day'
        );
        
        RAISE NOTICE 'Successfully seeded 6 realistic bookings';
    ELSE
        RAISE NOTICE 'Bookings already exist, skipping seed';
    END IF;
END $$;
