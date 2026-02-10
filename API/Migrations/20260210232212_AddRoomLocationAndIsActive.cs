using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class AddRoomLocationAndIsActive : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "ConferenceRooms",
                type: "INTEGER",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<int>(
                name: "Location",
                table: "ConferenceRooms",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.UpdateData(
                table: "ConferenceRooms",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "IsActive", "Location" },
                values: new object[] { true, 0 });

            migrationBuilder.UpdateData(
                table: "ConferenceRooms",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "IsActive", "Location" },
                values: new object[] { true, 1 });

            migrationBuilder.UpdateData(
                table: "ConferenceRooms",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "IsActive", "Location" },
                values: new object[] { true, 2 });

            migrationBuilder.UpdateData(
                table: "ConferenceRooms",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "IsActive", "Location" },
                values: new object[] { true, 4 });

            migrationBuilder.UpdateData(
                table: "ConferenceRooms",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "IsActive", "Location" },
                values: new object[] { true, 3 });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "ConferenceRooms");

            migrationBuilder.DropColumn(
                name: "Location",
                table: "ConferenceRooms");
        }
    }
}
