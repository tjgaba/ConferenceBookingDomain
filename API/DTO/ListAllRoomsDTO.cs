namespace ConferenceBooking.API.DTO
{
    public class ListAllRoomsDTO
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public int Capacity { get; set; }
        public int Number { get; set; }
        public string? Location { get; set; }
        public bool IsActive { get; set; }
    }
}
