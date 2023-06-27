import { AuthContext } from "./UserContext";
import React, { useContext } from "react";
// import { useLocation } from "react-router-dom";

const UserCard = ({ deleteUser }) => {
  const { user } = useContext(AuthContext);
  // const location = useLocation();


  if (!user) {
    return <p>Loading user data...</p>;
  }

  // const { first_name, last_name, username, email } = user;
  
  

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="user-card bg-gray-100 rounded-lg p-6 shadow-lg w-96">
        <h2 className="text-3xl font-bold mb-4 text-center">Your Profile</h2>
        <div className="flex items-center mb-6">
          <div className="ml-4">
            <p className="text-lg font-semibold">{user.first_name} {user.last_name}</p>
            <p className="text-gray-600">{user.username}</p>
          </div>
        </div>
        <div className="mb-6">
          <p className="font-semibold">Email:</p>
          <p>{user.email}</p>
        </div>
        <button
          onClick={deleteUser}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 w-full"
        >
          Delete User
        </button>
        <button
          // onClick={handleEdit}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full"
        ></button>
      </div>
    </div>
  );
};

export default UserCard;







