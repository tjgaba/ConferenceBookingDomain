// BookingCard.jsx — Displays a single booking.
// This component receives data through "props" (properties passed from a parent component).
// Props flow downward: Parent → Child. This is called "one-way data flow."
// Components should be "pure" — given the same props, they always render the same output.
// No state, no side effects — just a function that transforms data into UI.

import Button from "./Button";

function BookingCard({ booking }) {
  // We destructure { booking } from props.
  // This is the same as writing: function BookingCard(props) { const booking = props.booking; }

  return (
    <div>
      <h3>
        {booking.roomName} - {booking.location}
      </h3>
      <p>
        <strong>Room:</strong> {booking.roomName} ({booking.location})
      </p>
      <p>
        <strong>Time:</strong> {booking.startTime} to {booking.endTime}
      </p>
      <p>
        <span>
          {booking.status}
        </span>
      </p>
      <div>
        <Button label="Edit" />
        <Button label="Cancel" />
      </div>
    </div>
  );
}

export default BookingCard;
