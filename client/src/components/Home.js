import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import Exercise from './Exercise';
import Nutrition from './Nutrition';
import Mindfulness from './Mindfulness';
import Dashboard from './Dashboard';
import { useDrop } from 'react-dnd';
import { ItemTypes } from './ItemTypes';
import { AuthContext } from './UserContext';


const Home = () => {
  const [showExercise, setShowExercise] = useState(false);
  const [showNutrition, setShowNutrition] = useState(false);
  const [showMindfulness, setShowMindfulness] = useState(false);
  const [droppedMindfulness, setDroppedMindfulness] = useState(null);
  const { handleLogout } = useContext(AuthContext); 

  const handleToggleMindfulness = () => {
    setShowMindfulness(!showMindfulness);
  };

  const handleToggleNutrition = () => {
    setShowNutrition(!showNutrition);
  };

  const handleToggleExercise = () => {
    setShowExercise(!showExercise);
  };

  const handleDrop = (item) => {
    const { mindfulness } = item;
    setDroppedMindfulness(mindfulness);
  };

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.CARD,
    drop: (item) => {
      handleDrop(item);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const dropzoneStyle = {
    backgroundColor: isOver ? 'lightblue' : 'white',
    border: '2px dashed gray',
    padding: '20px',
    textAlign: 'center',
  };

  return (
  
      <div className="home">
        <nav className="flex justify-between items-center bg-gray-800 p-6">
          <div>
            <button
            onClick={handleLogout}
            className="flex items-center text-white mt-4 underline mr-4"
          >
            Logout
          </button>
          </div>
          <div>
            <ul className="flex space-x-4">
            <div>
                  <Link to="/calendar" className="text-white hover:text-gray-300">
                    Calendar
                  </Link>
                </div>
              <li>
                <Link to="/noteboard" className="text-white hover:text-gray-300">
                  To Do List
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
          <h1 className="text-3xl font-bold mb-4 text-center">Account-a-billy-buddy</h1>
          <div className="flex justify-center">
            <div className="w-1/2">
              <h2 className="text-xl font-semibold mb-4 text-center">Log your health</h2>
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
                    showNutrition ? 'bg-blue-600' : ''
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
              {showMindfulness && (
                <div>
                  <Mindfulness
                    key="mindfulness"
                    handleToggleMindfulness={handleToggleMindfulness}
                    droppedMindfulness={droppedMindfulness}
                    handleDrop={handleDrop}
                  />
                </div>
              )}
            </div>
            <div className="w-1/2">
              <Dashboard droppedMindfulness={droppedMindfulness} dropzoneStyle={dropzoneStyle}  drop={drop}/>
            </div>
          </div>
      </div>
  );
};

export default Home;
