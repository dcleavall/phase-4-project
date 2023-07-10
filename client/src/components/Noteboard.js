import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import { ChevronLeftIcon } from '@heroicons/react/outline';

import { AuthContext } from "./UserContext";
import { useContext } from "react";


const Noteboard = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const history = useHistory();
  const { handleLogout } = useContext(AuthContext);

  const [crossedOffRequirements, setCrossedOffRequirements] = useState([]);
  // Project Requirements array
  const projectRequirements = [
    "Implement Flask and SQLAlchemy in an application backend",
    "Include a many-to-many relationship",
    "Implement a minimum of 4 models",
    "Implement a minimum of 5 client-side routes using React Router",
    "Include full CRUD on at least 1 model, following REST conventions",
    "Implement validations and error handling",
    "Implement something new not taught in the curriculum",
    "Implement useContext or Redux",
  ];

  // State for crossed off requirements

  // Function to handle requirement click
  const handleRequirementClick = (index) => {
    if (crossedOffRequirements.includes(index)) {
      // If requirement is already crossed off, remove it from the list
      setCrossedOffRequirements((prevState) => prevState.filter((item) => item !== index));
    } else {
      // If requirement is not crossed off, add it to the list
      setCrossedOffRequirements((prevState) => [...prevState, index]);
    }
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handlePost = () => {
    // Handle the blog post submission logic here
    console.log('Note posted');
  };

  const redirectToHomePage = () => {
    history.push("/");
  };

  return (
    <div className="bg-gray-900 text-white flex flex-col items-center">
      <div className="flex items-center">
          <button
            onClick={redirectToHomePage}
            className="flex items-center text-navy mt-4 underline mr-4"
          >
            <ChevronLeftIcon className="w-4 h-4 mr-2" />
            Home
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center text-navy mt-4 underline mr-4"
          >
            Logout
          </button>
        </div>
      <header className="shadow py-6 flex justify-center items-center w-full">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-semibold">To Do List</h1>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gray-800 shadow-md rounded-lg p-6 mb-8">
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              className="text-2xl font-semibold text-gray-100 bg-gray-700 mb-4 w-full p-2 rounded"
              placeholder="add a title for your post..."
            />
            <textarea
              value={content}
              onChange={handleContentChange}
              className="text-gray-100 bg-gray-700 mb-4 w-full p-2 rounded"
              rows="8"
              placeholder="post content..."
            />
            <div className="flex justify-end">
              <button
                onClick={handlePost}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Post
              </button>
            </div>
          </div>
          <div className="w-full lg:w-7/12 p-4 bg-gray-800 mt-4 overflow-auto">
          <div className="text-2xl font-bold text-gray-300 mb-2">Project Requirements:</div>
          <ul className="list-disc list-inside text-gray-400">
            {projectRequirements.map((requirement, index) => (
              <li
                key={index}
                className={`${
                  crossedOffRequirements.includes(index) ? "line-through text-red-500" : ""
                }`}
                onClick={() => handleRequirementClick(index)}
              >
                {requirement}
              </li>
            ))}
          </ul>
        </div>
        </div>
      </main>
    </div>
  );
};

export default Noteboard;






