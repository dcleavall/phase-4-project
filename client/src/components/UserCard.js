import React from "react";


const UserCard = ({ user, deleteUser }) => {
  if (!user) {
    return <p>Loading user data...</p>;
  }

  return (
    <div className="user-card">
      <h2>Content</h2>
      <p>Email: {user.email}</p>
      <p>Location:</p>
      <button onClick={deleteUser}>Delete User</button>
    </div>
  );
};

export default UserCard;





