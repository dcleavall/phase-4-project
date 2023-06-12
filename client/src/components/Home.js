// Home.js
import React from "react";
import UserCard from "./UserCard";

const Home = ({ user, deleteUser }) => {
  return (
    <div className="home">
      <h1>Welcome to the Homepage</h1>
      {user ? (
        <>
          <UserCard user={user} />
          <button onClick={deleteUser}>Delete User</button>
        </>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default Home;


