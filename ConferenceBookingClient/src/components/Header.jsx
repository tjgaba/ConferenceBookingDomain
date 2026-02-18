// Header.jsx — A presentational component with user info and actions.
// Components are functions that return JSX.
// JSX looks like HTML but is actually JavaScript syntax that React transforms into DOM elements.
// This component now includes user information, logout, and create user functionality.
//
// LIFECYCLE & CLEANUP (The Heartbeat):
//   - setInterval runs every 3 seconds to simulate background checks
//   - Cleanup function (clearInterval) prevents memory leaks on unmount
//   - Demonstrates proper useEffect cleanup pattern

import { useEffect } from "react";
import "./Header.css";
import UserInfo from "./UserInfo";
import LogoutButton from "./LogoutButton";
import CreateUserButton from "./CreateUserButton";
import { currentUser } from "../Data/mockData";

function Header() {
  // EFFECT: Background "Heartbeat" - checks for updates every 3 seconds
  // This simulates a background process that keeps checking the server
  useEffect(() => {
    console.log('🚀 Heartbeat started - checking for updates every 3 seconds');

    // setInterval executes the callback every 3000ms (3 seconds)
    const intervalId = setInterval(() => {
      console.log('💓 Checking for updates...');
    }, 3000);

    // CLEANUP FUNCTION: Clears the interval when component unmounts
    // Without this, the interval would continue running even after the component is removed
    // This would cause a memory leak and "Can't perform state update on unmounted component" errors
    return () => {
      clearInterval(intervalId);
      console.log('🛑 Heartbeat stopped - cleanup completed');
    };
  }, []); // Empty dependency array = run once on mount, cleanup on unmount

  return (
    <header>
      <div className="header-left">
        <h1>Conference Booking Dashboard</h1>
        <p>
          Manage conference room bookings and availability
        </p>
      </div>

      <div className="header-right">
        <UserInfo user={currentUser} />
        <div className="header-actions">
          <CreateUserButton />
          <LogoutButton />
        </div>
      </div>
      
      <nav>
        <a href="#">Home</a>
        <a href="#">Bookings</a>
        <a href="#">Rooms</a>
        <a href="#">About</a>
      </nav>
      
      
    </header>
  );
}

// Every component file must export its component so other files can import it.
// "export default" means this is the main thing this file provides.
export default Header;
