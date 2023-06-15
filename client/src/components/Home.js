import React, { useState } from "react";
import { Link } from "react-router-dom";

const Home = ({ user }) => {
  const [selectedHealthChoice, setSelectedHealthChoice] = useState("");

  const handleHealthChoiceSelect = (healthChoice) => {
    setSelectedHealthChoice(healthChoice);
  };

  return (
    <div className="home">
      <h1>Welcome to the Homepage</h1>
      {user ? (
        <>
          <div className="account-button-container">
            <Link to="/account" className="account-button">
              Account
            </Link>
          </div>
          <h2>Select a Health Choice:</h2>
          <div className="health-choice-buttons">
            <button
              className={selectedHealthChoice === "exercise" ? "selected" : ""}
              onClick={() => handleHealthChoiceSelect("exercise")}
            >
              Exercise
            </button>
            <button
              className={selectedHealthChoice === "nutrition" ? "selected" : ""}
              onClick={() => handleHealthChoiceSelect("nutrition")}
            >
              Nutrition
            </button>
            <button
              className={selectedHealthChoice === "mindfulness" ? "selected" : ""}
              onClick={() => handleHealthChoiceSelect("mindfulness")}
            >
              Mindfulness
            </button>
          </div>
          {selectedHealthChoice && (
            <p>You selected: {selectedHealthChoice}</p>
          )}
        </>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default Home;






