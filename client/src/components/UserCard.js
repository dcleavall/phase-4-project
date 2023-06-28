import { AuthContext } from "./UserContext";
import React, { useContext } from "react";


const UserCard = ({ deleteUser }) => {
  const { user } = useContext(AuthContext);


  if (!user) {
    return <p>Loading user data...</p>;
  }


  return (
    <div className="flex justify-center items-center bg-gradient-to-b from-navy-900 to-gray-900">
      <div className="user-card bg-gray-800 rounded-lg p-6 shadow-lg max-w-xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center text-white">Your Profile</h2>
        <div className="flex flex-col items-center mb-8">
          <p className="text-lg font-semibold text-white mb-2">{user.first_name} {user.last_name}</p>
          <p className="text-gray-400">{user.username}</p>
        </div>
        <div className="mb-8">
          <p className="font-semibold text-white">Email:</p>
          <p className="text-white">{user.email}</p>
        </div>
        <button
          onClick={deleteUser}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 w-full mb-4"
        >
          Delete User
        </button>
        <button
          // onClick={handleEdit}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default UserCard;










