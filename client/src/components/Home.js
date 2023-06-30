import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Exercise from './Exercise';
import Nutrition from './Nutrition';
import Mindfulness from './Mindfulness';

const Home = () => {
  const [showExercise, setShowExercise] = useState(false);
  const [showNutrition, setShowNutrition] = useState(false);
  const [showMindfulness, setShowMindfulness] = useState(false);

  const handleToggleMindfulness = () => {
    setShowMindfulness(!showMindfulness);
  };

  const handleToggleNutrition = () => {
    setShowNutrition(!showNutrition);
  };

  const handleToggleExercise = () => {
    setShowExercise(!showExercise);
  };

  return (
    <div className="home">
      <nav className="flex justify-between items-center bg-gray-800 p-6">
        <div>
          <Link to="/" className="text-xl font-bold text-white">
            Logo
          </Link>
        </div>
        <div>
          <ul className="flex space-x-4">
            <li>
              <Link to="/dashboard" className="text-white hover:text-gray-300">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/noteboard" className="text-white hover:text-gray-300">
                Noteboard
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-white hover:text-gray-300">
                About
              </Link>
            </li>
            <li>
              <Link to="/account" className="text-white hover:text-gray-300">
                Account
              </Link>
            </li>
          </ul>
        </div>
      </nav>
      <h1 className="text-3xl font-bold mb-4 text-center">
        Live a Healthier and Gain Rewards!
      </h1>
      <div className="flex justify-center">
        <div className="w-1/2">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Healthy Lifestyle Choice:
          </h2>
          <div className="health-choice-buttons flex justify-center mb-4">
            <button
              className={`rounded-lg py-2 px-4 mr-2 bg-blue-500 hover:bg-blue-600 ${
                showExercise ? 'bg-blue-600' : ''
              }`}
              onClick={handleToggleExercise}
            >
              Exercise
            </button>
            <button
              className={`rounded-lg py-2 px-4 mr-2 bg-blue-500 hover:bg-blue-600 ${
                showExercise ? 'bg-blue-600' : ''
              }`}
              onClick={handleToggleNutrition}
            >
              Nutrition
            </button>
            <button
              className={`rounded-lg py-2 px-4 mr-2 bg-blue-500 hover:bg-blue-600 ${
                showMindfulness ? 'bg-blue-600' : ''
              }`}
              onClick={handleToggleMindfulness}
            >
              Mindfulness
            </button>
          </div>
          {showExercise && <Exercise key="exercise" handleToggleExercise={handleToggleExercise} />}
          {showNutrition && <Nutrition key="nutrition" handleToggleNutrition={handleToggleNutrition} />}
          {showMindfulness && <Mindfulness key="mindfulness" handleToggleMindfulness={handleToggleMindfulness} />}
        </div>
      </div>
    </div>
  );
};

export default Home;


























