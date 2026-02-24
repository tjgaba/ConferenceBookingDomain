// UserInfo.jsx — Displays the logged-in user's information
// Works with both mock user {name, role} and real API user {username, roles[]}

import "./UserInfo.css";

function UserInfo({ user }) {
  if (!user) return null;

  // Support both mock {name, role} and real API {username, roles[]}
  const displayName = user.username || user.name || 'User';
  const displayRole = user.roles ? user.roles.join(', ') : (user.role || 'Unknown');
  const initials = displayName.split(/[@.\s]/).filter(Boolean).map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="user-info">
      <div className="user-details">
        <span className="user-name">{displayName}</span>
        <span className="user-role">{displayRole}</span>
      </div>
      <div className="user-avatar">
        {initials}
      </div>
    </div>
  );
}

export default UserInfo;
