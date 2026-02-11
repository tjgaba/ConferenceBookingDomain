using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class SeedRequiredTestData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Bookings",
                columns: new[] { "Id", "CancelledAt", "Capacity", "CreatedAt", "EndTime", "Location", "RequestedBy", "RoomId", "StartTime", "Status" },
                values: new object[] { 9001, null, 10, new DateTimeOffset(new DateTime(2026, 2, 10, 10, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), new DateTimeOffset(new DateTime(2026, 2, 15, 16, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), 1, "seed.user@test.com", 6, new DateTimeOffset(new DateTime(2026, 2, 15, 14, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), 1 });

            migrationBuilder.InsertData(
                table: "ConferenceRooms",
                columns: new[] { "Id", "Capacity", "IsActive", "Location", "Name", "Number" },
                values: new object[] { 26, 12, false, 4, "Archived Meeting Room", 506 });

            migrationBuilder.InsertData(
                table: "Sessions",
                columns: new[] { "Id", "Capacity", "Description", "EndTime", "RoomId", "StartTime", "Title" },
                values: new object[] { 9001, 10, "Quarterly strategic planning and review meeting", new DateTimeOffset(new DateTime(2026, 3, 1, 11, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), 6, new DateTimeOffset(new DateTime(2026, 3, 1, 9, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "Q1 Strategy Planning Session" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Bookings",
                keyColumn: "Id",
                keyValue: 9001);

            migrationBuilder.DeleteData(
                table: "ConferenceRooms",
                keyColumn: "Id",
                keyValue: 26);

            migrationBuilder.DeleteData(
                table: "Sessions",
                keyColumn: "Id",
                keyValue: 9001);
        }
    }
}
