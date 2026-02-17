// Header.jsx — A simple presentational component.
// Components are functions that return JSX.
// JSX looks like HTML but is actually JavaScript syntax that React transforms into DOM elements.
// This component takes no props — it just renders a static header with navigation links.

import "./Header.css";

function Header() {
  return (
    <header>
      <h1>Conference Booking Dashboard</h1>
      <nav>
        <a href="#">Home</a>
        <a href="#">Bookings</a>
        <a href="#">Rooms</a>
        <a href="#">About</a>
      </nav>
      <p>
        Manage conference room bookings and availability
      </p>
    </header>
  );
}

// Every component file must export its component so other files can import it.
// "export default" means this is the main thing this file provides.
export default Header;
