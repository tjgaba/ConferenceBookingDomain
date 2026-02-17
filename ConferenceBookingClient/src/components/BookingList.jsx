// BookingList.jsx — Renders a list of BookingCard components.
// This demonstrates two key React concepts:
//
// 1. Component Composition: BookingList uses BookingCard inside it.
//    Components can contain other components, forming a tree (just like HTML elements).
//
// 2. Rendering Lists with .map() and Keys:
//    - We use JavaScript's .map() to transform each data item into a <BookingCard />.
//    - Every item in a list MUST have a unique "key" prop.
//    - React uses keys to track which items changed, were added, or were removed between renders.
//    - Keys help React optimize re-renders and prevent UI bugs (like inputs losing their values).
//    - NEVER use the array index as a key — if the list order changes, React will mix up the items.
//    - Always use a stable, unique identifier (like an id from the database).

import BookingCard from "./BookingCard";
import "./BookingList.css";

function BookingList({ bookings }) {
  return (
    <div className="booking-list">
      <h2>
        Current Bookings
      </h2>
      <div className="bookings-grid">
        {bookings.map((booking) => (
        // key={booking.id} tells React how to identify each item uniquely.
        // This is critical for performance and correctness when the list changes.
          <BookingCard key={booking.id} booking={booking} />
        ))}
      </div>
    </div>
  );
}

export default BookingList;
