using System.Text.Json.Serialization;

namespace ConferenceBooking.API.Entities
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum RoomLocation
    {
        London,
        CapeTown,
        Johannesburg,
        Bloemfontein,
        Durban
    }
}
