'use client';
// Header.jsx — A presentational component with user info and actions.
// Now accepts auth props so the login/logout button lives inside the header.
//
// 'use client': renders <button onClick={onLogin}> and <button onClick={onLogout}>.
// Event handlers cannot be attached in a Server Component.

import "./Header.css";
import UserInfo from "./UserInfo";
import CreateUserButton from "./CreateUserButton";
import ConnectionStatus from "./ConnectionStatus";

function Header({ isLoggedIn = false, currentUser = null, onLogin, onLogout }) {
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
