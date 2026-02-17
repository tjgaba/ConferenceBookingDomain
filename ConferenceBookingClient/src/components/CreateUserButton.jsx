// CreateUserButton.jsx — Button for creating a new user account
// In future, this will navigate to user creation form or open a modal

import "./CreateUserButton.css";

function CreateUserButton() {
  const handleCreateUser = () => {
    // TODO: In a real app, this would:
    // 1. Navigate to user creation page
    // 2. Or open a modal with user creation form
    alert("Create User clicked! (Not implemented yet)");
  };

  return (
    <button className="create-user-button" onClick={handleCreateUser}>
      <svg 
        className="create-user-icon" 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="8.5" cy="7" r="4" />
        <line x1="20" y1="8" x2="20" y2="14" />
        <line x1="23" y1="11" x2="17" y2="11" />
      </svg>
      Create New User
    </button>
  );
}

export default CreateUserButton;
