// UserInfo.jsx — Displays the logged-in user's information
// Shows user name and role in a styled container

import "./UserInfo.css";

function UserInfo({ user }) {
  return (
    <div className="user-info">
      <div className="user-details">
        <span className="user-name">{user.name}</span>
        <span className="user-role">{user.role}</span>
      </div>
      <div className="user-avatar">
        {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
      </div>
    </div>
  );
}

export default UserInfo;
