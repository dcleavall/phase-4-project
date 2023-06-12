// UserCard.js
import React from "react";

const UserCard = ({ user }) => {
  if (!user) {
    return <p>Loading user data...</p>;
  }

  return (
    <div className="user-card">
      <h2>Content</h2>
      <p>Email : {user.email} </p>
      <p>Location:</p>
    </div>
  );
};

export default UserCard;


