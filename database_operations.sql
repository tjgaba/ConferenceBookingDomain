-- ========================================
-- CONFERENCE BOOKING - DATABASE OPERATIONS
-- ========================================
-- Run these commands in pgAdmin, DBeaver, or any PostgreSQL client
-- Connected to database: conference_booking_db

-- ========================================
-- 1. VERIFY TABLES EXIST
-- ========================================
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- ========================================
-- 2. COUNT EXISTING RECORDS
-- ========================================
SELECT 'AspNetUsers' as table_name, COUNT(*) as count FROM "AspNetUsers"
UNION ALL
SELECT 'ConferenceRooms', COUNT(*) FROM "ConferenceRooms"
UNION ALL
SELECT 'Bookings', COUNT(*) FROM "Bookings";

-- ========================================
-- 3. VIEW ALL ROOMS
-- ========================================
SELECT "Id", "Name", "Number", "Capacity", "Location", "IsActive"
FROM "ConferenceRooms"
WHERE "IsActive" = true
ORDER BY "Location", "Number";

-- ========================================
-- 4. VIEW ALL USERS
-- ========================================
SELECT "Id", "Email", "FirstName", "LastName", "IsActive"
FROM "AspNetUsers"
WHERE "Discriminator" = 'ApplicationUser'
ORDER BY "Email";

-- ========================================
-- 5. VIEW ALL BOOKINGS
-- ========================================
SELECT 
    b."Id",
    u."Email" as "UserEmail",
    r."Name" as "RoomName",
    b."StartTime",
    b."EndTime",
    b."Status",
    b."CreatedAt"
FROM "Bookings" b
JOIN "AspNetUsers" u ON b."UserId" = u."Id"
JOIN "ConferenceRooms" r ON b."RoomId" = r."Id"
ORDER BY b."CreatedAt" DESC;

-- ========================================
-- 6. INSERT A NEW BOOKING (MANUAL)
-- ========================================
-- First, get a user ID and room ID:
-- SELECT "Id", "Email" FROM "AspNetUsers" WHERE "Email" = 'admin@domain.com';
-- SELECT "Id", "Name" FROM "ConferenceRooms" WHERE "IsActive" = true LIMIT 1;

-- Then insert (replace USER_ID and ROOM_ID with actual values):
INSERT INTO "Bookings" ("RoomId", "UserId", "StartTime", "EndTime", "Status", "CreatedAt")
VALUES (
    1,  -- Replace with actual RoomId
    'YOUR_USER_ID_HERE',  -- Replace with actual UserId (UUID string)
    CURRENT_DATE + INTERVAL '2 days' + INTERVAL '10 hours',
    CURRENT_DATE + INTERVAL '2 days' + INTERVAL '12 hours',
    0,  -- 0=Pending, 1=Confirmed, 2=Cancelled
    NOW()
);

-- ========================================
-- 7. UPDATE A BOOKING
-- ========================================
-- Change status to Confirmed (replace booking ID):
UPDATE "Bookings"
SET "Status" = 1, "CancelledAt" = NULL
WHERE "Id" = 1;  -- Replace with actual booking ID

-- ========================================
-- 8. DELETE A BOOKING
-- ========================================
-- Hard delete (replace booking ID):
DELETE FROM "Bookings"
WHERE "Id" = 1;  -- Replace with actual booking ID

-- ========================================
-- 9. SEED 6 REALISTIC BOOKINGS
-- ========================================
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
    -- Get user IDs
    SELECT "Id" INTO admin_id FROM "AspNetUsers" WHERE "Email" = 'admin@domain.com' LIMIT 1;
    SELECT "Id" INTO employee_id FROM "AspNetUsers" WHERE "Email" = 'employee@domain.com' LIMIT 1;
    SELECT "Id" INTO receptionist_id FROM "AspNetUsers" WHERE "Email" = 'receptionist@domain.com' LIMIT 1;
    
    -- Get room IDs (first 5 active rooms)
    SELECT "Id" INTO room1_id FROM "ConferenceRooms" WHERE "IsActive" = true ORDER BY "Id" LIMIT 1 OFFSET 0;
    SELECT "Id" INTO room2_id FROM "ConferenceRooms" WHERE "IsActive" = true ORDER BY "Id" LIMIT 1 OFFSET 1;
    SELECT "Id" INTO room3_id FROM "ConferenceRooms" WHERE "IsActive" = true ORDER BY "Id" LIMIT 1 OFFSET 2;
    SELECT "Id" INTO room4_id FROM "ConferenceRooms" WHERE "IsActive" = true ORDER BY "Id" LIMIT 1 OFFSET 3;
    SELECT "Id" INTO room5_id FROM "ConferenceRooms" WHERE "IsActive" = true ORDER BY "Id" LIMIT 1 OFFSET 4;
    
    -- Clear existing bookings first (optional - remove if you want to keep existing)
    DELETE FROM "Bookings";
    
    -- Booking 1: Confirmed - Today morning
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
    
    RAISE NOTICE '✓ Successfully seeded 6 realistic bookings';
END $$;

-- ========================================
-- 10. VERIFY BOOKINGS WERE INSERTED
-- ========================================
SELECT COUNT(*) as "Total Bookings" FROM "Bookings";

SELECT 
    b."Id",
    u."Email",
    r."Name" as "Room",
    b."StartTime",
    b."Status"
FROM "Bookings" b
JOIN "AspNetUsers" u ON b."UserId" = u."Id"
JOIN "ConferenceRooms" r ON b."RoomId" = r."Id"
ORDER BY b."StartTime";
