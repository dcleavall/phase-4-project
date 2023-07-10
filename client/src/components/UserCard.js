import { useState } from "react";
import { useHistory } from "react-router-dom";
import { ChevronLeftIcon } from '@heroicons/react/outline';
import { Modal, Button } from "react-bootstrap";

import { AuthContext } from "./UserContext";
import React, { useContext } from "react";

const UserCard = () => {
  const history = useHistory();
  const { user, handleLogout, deleteUser } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);

  const redirectToHomePage = () => {
    history.push("/");
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSaveChanges = () => {
    // Handle saving changes in the form
    // Add your logic here
  };

  if (!user) {
    return <p>Loading user data...</p>;
  }

  return (
    <div className="bg-gray-500 flex flex-col items-center min-h-screen">
      <div className="flex items-center">
        <button
          onClick={redirectToHomePage}
          className="flex items-center text-white mt-4 underline mr-4"
        >
          <ChevronLeftIcon className="w-4 h-4 mr-2" />
          Home
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center text-white mt-4 underline mr-4"
        >
          Logout
        </button>
      </div>
      <br />
      <div className="flex bg-navy justify-center items-center">
        <div className="user-card bg-gray-800 rounded-lg p-6 shadow-lg max-w-xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-white text-navy">Your Profile</h2>
          <div className="mb-6">
            <label className="block text-white font-semibold mb-2">Full Name</label>
            <p className="italic text-white">{user.first_name} {user.last_name}</p>
          </div>
          <div className="mb-6">
            <label className="block text-white font-semibold mb-2">Username</label>
            <p className="italic text-white">{user.username}</p>
          </div>
          <div className="mb-6">
            <label className="block text-white font-semibold mb-2">Email</label>
            <p className="italic text-white">{user.email}</p>
          </div>
          <div className="flex justify-between">
            <button
              onClick={deleteUser}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete Account
            </button>
            <button
              onClick={handleShowModal}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Add your form fields and logic here */}
          <p>Modal content goes here...</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserCard;
