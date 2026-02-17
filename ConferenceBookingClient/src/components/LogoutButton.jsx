// LogoutButton.jsx — Button for logging out the current user
// In future, this will clear auth tokens and redirect to login

import "./LogoutButton.css";

function LogoutButton() {
  const handleLogout = () => {
    // TODO: In a real app, this would:
    // 1. Clear auth tokens from localStorage/sessionStorage
    // 2. Clear user context/state
    // 3. Redirect to login page
    alert("Logout clicked! (Not implemented yet)");
  };

  return (
    <button className="logout-button" onClick={handleLogout}>
      <svg 
        className="logout-icon" 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2"
      >
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </svg>
      Logout
    </button>
  );
}

export default LogoutButton;
