using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class StandardizeRoomsAcrossLocations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "ConferenceRooms",
                keyColumn: "Id",
                keyValue: 2,
                column: "Location",
                value: 0);

            migrationBuilder.UpdateData(
                table: "ConferenceRooms",
                keyColumn: "Id",
                keyValue: 3,
                column: "Location",
                value: 0);

            migrationBuilder.UpdateData(
                table: "ConferenceRooms",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "Location", "Number" },
                values: new object[] { 0, 104 });

            migrationBuilder.UpdateData(
                table: "ConferenceRooms",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "Location", "Number" },
                values: new object[] { 0, 105 });

            migrationBuilder.InsertData(
                table: "ConferenceRooms",
                columns: new[] { "Id", "Capacity", "IsActive", "Location", "Name", "Number" },
                values: new object[,]
                {
                    { 6, 10, true, 1, "Conference Room A", 201 },
                    { 7, 8, true, 1, "Conference Room B", 202 },
                    { 8, 15, true, 1, "Conference Room C", 203 },
                    { 9, 20, true, 1, "Board Room", 204 },
                    { 10, 6, true, 1, "Meeting Room 1", 205 },
                    { 11, 10, true, 2, "Conference Room A", 301 },
                    { 12, 8, true, 2, "Conference Room B", 302 },
                    { 13, 15, true, 2, "Conference Room C", 303 },
                    { 14, 20, true, 2, "Board Room", 304 },
                    { 15, 6, true, 2, "Meeting Room 1", 305 },
                    { 16, 10, true, 3, "Conference Room A", 401 },
                    { 17, 8, true, 3, "Conference Room B", 402 },
                    { 18, 15, true, 3, "Conference Room C", 403 },
                    { 19, 20, true, 3, "Board Room", 404 },
                    { 20, 6, true, 3, "Meeting Room 1", 405 },
                    { 21, 10, true, 4, "Conference Room A", 501 },
                    { 22, 8, true, 4, "Conference Room B", 502 },
                    { 23, 15, true, 4, "Conference Room C", 503 },
                    { 24, 20, true, 4, "Board Room", 504 },
                    { 25, 6, true, 4, "Meeting Room 1", 505 }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "ConferenceRooms",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "ConferenceRooms",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "ConferenceRooms",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "ConferenceRooms",
                keyColumn: "Id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "ConferenceRooms",
                keyColumn: "Id",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "ConferenceRooms",
                keyColumn: "Id",
                keyValue: 11);

            migrationBuilder.DeleteData(
                table: "ConferenceRooms",
                keyColumn: "Id",
                keyValue: 12);

            migrationBuilder.DeleteData(
                table: "ConferenceRooms",
                keyColumn: "Id",
                keyValue: 13);

            migrationBuilder.DeleteData(
                table: "ConferenceRooms",
                keyColumn: "Id",
                keyValue: 14);

            migrationBuilder.DeleteData(
                table: "ConferenceRooms",
                keyColumn: "Id",
                keyValue: 15);

            migrationBuilder.DeleteData(
                table: "ConferenceRooms",
                keyColumn: "Id",
                keyValue: 16);

            migrationBuilder.DeleteData(
                table: "ConferenceRooms",
                keyColumn: "Id",
                keyValue: 17);

            migrationBuilder.DeleteData(
                table: "ConferenceRooms",
                keyColumn: "Id",
                keyValue: 18);

            migrationBuilder.DeleteData(
                table: "ConferenceRooms",
                keyColumn: "Id",
                keyValue: 19);

            migrationBuilder.DeleteData(
                table: "ConferenceRooms",
                keyColumn: "Id",
                keyValue: 20);

            migrationBuilder.DeleteData(
                table: "ConferenceRooms",
                keyColumn: "Id",
                keyValue: 21);

            migrationBuilder.DeleteData(
                table: "ConferenceRooms",
                keyColumn: "Id",
                keyValue: 22);

            migrationBuilder.DeleteData(
                table: "ConferenceRooms",
                keyColumn: "Id",
                keyValue: 23);

            migrationBuilder.DeleteData(
                table: "ConferenceRooms",
                keyColumn: "Id",
                keyValue: 24);

            migrationBuilder.DeleteData(
                table: "ConferenceRooms",
                keyColumn: "Id",
                keyValue: 25);

            migrationBuilder.UpdateData(
                table: "ConferenceRooms",
                keyColumn: "Id",
                keyValue: 2,
                column: "Location",
                value: 1);

            migrationBuilder.UpdateData(
                table: "ConferenceRooms",
                keyColumn: "Id",
                keyValue: 3,
                column: "Location",
                value: 2);

            migrationBuilder.UpdateData(
                table: "ConferenceRooms",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "Location", "Number" },
                values: new object[] { 4, 201 });

            migrationBuilder.UpdateData(
                table: "ConferenceRooms",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "Location", "Number" },
                values: new object[] { 3, 104 });
        }
    }
}
