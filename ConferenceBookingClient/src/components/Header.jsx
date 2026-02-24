// Header.jsx — A presentational component with user info and actions.
// Now accepts auth props so the login/logout button lives inside the header.

import { useEffect } from "react";
import "./Header.css";
import UserInfo from "./UserInfo";
import CreateUserButton from "./CreateUserButton";
import ConnectionStatus from "./ConnectionStatus";

function Header({ isLoggedIn = false, currentUser = null, onLogin, onLogout }) {
  // EFFECT: Background "Heartbeat" - checks for updates every 3 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      // background heartbeat
    }, 3000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <header>
      <div className="header-left">
        <h1>Conference Booking Dashboard</h1>
        <p>Manage conference room bookings and availability</p>
        <ConnectionStatus />
      </div>

      <div className="header-right">
        <nav>
          <a href="#">Home</a>
          <a href="#">Bookings</a>
          <a href="#">Rooms</a>
        </nav>

        <div className="header-actions">
          {isLoggedIn && (
            <>
              <UserInfo user={currentUser} />
              <CreateUserButton />
            </>
          )}

          <div className="header-auth">
            {isLoggedIn ? (
              <button className="btn-header btn-logout" onClick={onLogout}>
                Logout
              </button>
            ) : (
              <button className="btn-header btn-login" onClick={onLogin}>
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
