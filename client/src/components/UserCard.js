import React from "react";


const UserCard = ({ user, deleteUser }) => {
  if (!user) {
    return <p>Loading user data...</p>;
  }

  return (
    <div className="user-card">
      <h2>Your Profile</h2>
      <p>first_name: </p>
      <p>last_name: </p>
      <p>username: </p>
      <p>: </p>
      <button onClick={deleteUser}>Delete User</button>
    </div>
  );
};

export default UserCard;





