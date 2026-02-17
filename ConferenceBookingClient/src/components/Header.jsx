// Header.jsx — A presentational component with user info and actions.
// Components are functions that return JSX.
// JSX looks like HTML but is actually JavaScript syntax that React transforms into DOM elements.
// This component now includes user information, logout, and create user functionality.

import "./Header.css";
import UserInfo from "./UserInfo";
import LogoutButton from "./LogoutButton";
import CreateUserButton from "./CreateUserButton";
import { currentUser } from "../Data/mockData";

function Header() {
  return (
    <header>
      <div className="header-left">
        <h1>Conference Booking Dashboard</h1>
        <p>
          Manage conference room bookings and availability
        </p>
      </div>
      
      <nav>
        <a href="#">Home</a>
        <a href="#">Bookings</a>
        <a href="#">Rooms</a>
        <a href="#">About</a>
      </nav>
      
      <div className="header-right">
        <UserInfo user={currentUser} />
        <div className="header-actions">
          <CreateUserButton />
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}

// Every component file must export its component so other files can import it.
// "export default" means this is the main thing this file provides.
export default Header;
