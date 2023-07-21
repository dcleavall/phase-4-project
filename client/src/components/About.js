import { useHistory } from "react-router-dom";
import { ChevronLeftIcon } from '@heroicons/react/outline';
import { AuthContext } from "./UserContext";
import React, { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin, faGithub, faMedium, faSnapchat } from "@fortawesome/free-brands-svg-icons";

const About = () => {
  const history = useHistory();
  const { user, handleLogout } = useContext(AuthContext);

  const redirectToHomePage = () => {
    history.push("/");
  };

  if (!user) {
    return <p>Loading user data...</p>;
  }

  return (
    <section className="min-h-screen bg-gradient-to-r from-gray-800 to-gray-900 flex flex-col items-center overflow-y-auto">
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
      <div className="card mt-10">
        <h1 className="text-center">Meet the team</h1>
        <div className="container py-5 flex bg-gray-900 justify-center items-center flex-col">
          <div className="w-full lg:w-11/12 bg-gray-900 rounded-t text-white flex flex-col items-center shadow-lg">
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
              <div className="text-xl font-semibold mb-4 text-gray-300"></div>
              <div className="bg-gray-900 p-4 rounded-md shadow-md">
                <p className="italic text-gray-400 mb-2">Cultivator | Software Engineer</p>
                <p className="italic text-gray-400 mb-2">Lives in Denver</p>
                <p className="italic text-gray-400">Thanks for stopping by 🤙🏼</p>
              </div>
              <div className="media">
                <a href="https://www.linkedin.com/in/derrick-c-19659211a/" target="_blank" rel="noopener noreferrer" className="linkedin-icon text-gray-400 hover:text-blue-500 transform transition-transform">
                  <FontAwesomeIcon icon={faLinkedin} size="2x" />
                </a>
                <a href="https://github.com/dcleavall" target="_blank" rel="noopener noreferrer" className="github-icon text-gray-400 hover:text-blue-500 transform transition-transform">
                  <FontAwesomeIcon icon={faGithub} size="2x" />
                </a>
                <a href="https://medium.com/@dcleavall" target="_blank" rel="noopener noreferrer" className="medium-icon text-gray-400 hover:text-blue-500 transform transition-transform">
                  <FontAwesomeIcon icon={faMedium} size="2x" />
                </a>
                <a href="https://snapchat.com" target="_blank" rel="noopener noreferrer" className="snapchat-icon text-gray-400 hover:text-blue-500 transform transition-transform">
                  <FontAwesomeIcon icon={faSnapchat} size="2x" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
