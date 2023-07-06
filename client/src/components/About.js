import React, { useState } from "react";

const About = ({ user }) => {
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

  if (!user) {
    return <p>Loading user data...</p>;
  }

  return (
    <section className="h-screen bg-gradient-to-r from-gray-800 to-gray-900">
      <div className="container py-5 h-screen flex justify-center items-center flex-col">
        <div className="w-full lg:w-7/12 bg-gray-900 rounded-t text-white flex flex-col items-center shadow-lg">
          <div className="mt-5">
            <img
              src="/zbearImage.jpg"
              alt="Team Member 1"
              className="rounded-full w-24 h-34 object-cover"
            />
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-bold text-gray-300 mb-2">Derrick Cleavall</h3>
            <p className="text-gray-400">Abq, NM</p>
            <div className="text-xl font-semibold mb-4 text-gray-300">About</div>
            <div className="bg-gray-900 p-4 rounded-md shadow-md">
              <p className="italic text-gray-400 mb-2">Cultivator | Software Engineer</p>
              <p className="italic text-gray-400 mb-2">Lives in Denver</p>
              <p className="italic text-gray-400">Thanks for stopping by 🤙🏼</p>
            </div>
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
    </section>
  );
};

export default About;
