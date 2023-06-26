import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = ({ user }) => {
  const [selectedHealthChoice, setSelectedHealthChoice] = useState('');
  const [exerciseData, setExerciseData] = useState([]);
  const [nutritionData, setNutritionData] = useState([]);
  const [mindfulnessData, setMindfulnessData] = useState([]);

  useEffect(() => {
    fetch('/exercises')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error fetching exercise data');
        }
        return response.json();
      })
      .then((data) => {
        setExerciseData(data);
      })
      .catch((error) => {
        console.error('Error fetching exercise data:', error);
      });
      
  }, []);
  
  const handleHealthChoiceSelect = (healthChoice) => {
    setSelectedHealthChoice(healthChoice);
  };
  
  const handleWeightliftingSubmit = (e) => {
    e.preventDefault();
    const muscleGroup = e.target.muscleGroup.value;
    const duration = e.target.duration.value;
    const notes = e.target.notes.value;
  
    const exerciseData = {
      user_id: user.user_id,
      type: 'weightlifting',
      muscle_group: muscleGroup,
      duration: duration,
      notes: notes,
    };
  
    fetch('/exercises', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(exerciseData),
    })
      .then((response) => {
        if (response.ok) {
          console.log('Exercise data submitted successfully');
          e.target.reset();
          return response.json(); // Extract the JSON data from the response
        } else {
          throw new Error('Exercise data submission failed');
        }
      })
      .then(() => {
        // Fetch the updated exercise data
        return fetch('/exercises');
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error fetching exercise data');
        }
        return response.json();
      })
      .then((data) => {
        setExerciseData(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };
  
  
  const handleCardioSubmit = (e) => {
    e.preventDefault();
    const duration = e.target.duration.value;
    const distance = e.target.distance.value;



    // Create an object with the form data
    const cardioData = {
      user_id: user.user_id,
      type: 'cardio',
      duration: duration,
      distance: distance,
      notes: '',
    };
  
    // Make a POST request to the backend API endpoint
    fetch('/exercises', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cardioData),
    })
      .then((response) => {
        if (response.ok) {
          // Handle successful response
          console.log('Exercise data submitted successfully');
          // Reset the form after submission if needed
          e.target.reset();
          // Fetch updated exercise data
          fetch('/exercises')
            .then((response) => {
              if (!response.ok) {
                throw new Error('Error fetching exercise data');
              }
              return response.json();
            })
            .then((data) => {
              setExerciseData(data);
            })
            .catch((error) => {
              console.error('Error fetching exercise data:', error);
            });
        } else {
          // Handle error response
          throw new Error('Exercise data submission failed');
        }
      })
      .catch((error) => {
        // Handle error
        console.error('Error submitting exercise data:', error);
      });
  };

  const handleDelete = () => {
    // Make a DELETE request to the backend API endpoint for deleting the exercise
    fetch(`/exercises`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(exerciseData),
    })
      .then((response) => {
        if (response.ok) {
          // Handle successful deletion
          console.log('Exercise data deleted successfully');
          // Fetch updated exercise data
          fetch('/exercises')
            .then((response) => {
              if (!response.ok) {
                throw new Error('Error fetching exercise data');
              }
              return response.json();
            })
            .then((data) => {
              setExerciseData(data);
            })
            .catch((error) => {
              console.error('Error fetching exercise data:', error);
            });
        } else {
          // Handle error response
          throw new Error('Exercise data deletion failed');
        }
      })
      .catch((error) => {
        // Handle error
        console.error('Error deleting exercise data:', error);
      });
  };

  const handleEdit = () => {
    const updatedExerciseData = {
      // Update the exercise properties based on the changes made by the user
      user_id: user.user_id,
      type: exerciseData.type,
      muscle_group: exerciseData.muscle_group,
      duration: exerciseData.duration,
      distance: exerciseData.distance,
      notes: exerciseData.notes,
    };
  
    fetch(`/exercises`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedExerciseData),
    })
      .then((response) => {
        if (response.ok) {
          // Handle successful update
          console.log('Exercise data updated successfully');
          // Fetch updated exercise data
          response.json().then((data) => {
            setExerciseData(exerciseData => exerciseData.map(e => {
              return e.id !== data.id ? e : data;
            }))})
        } else {
          // Handle error response
          throw new Error('Exercise data update failed');
        }
      })
      .catch((error) => {
        // Handle error
        console.error('Error updating exercise data:', error);
      });
  };

  // useEffect(() => {
  //   fetch('/nutrition')
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error('Error fetching nutrition data');
  //       }
  //       return response.json();
  //     })
  //     .then((data) => {
  //       setNutritionData(data);
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching nutrition data:', error);
  //     });
  // }, []);

  const handleNutritionSubmit = (e) => {
    e.preventDefault();
    const meal = e.target.meal.value;
    const protein = e.target.protein.value;
    const fat = e.target.fat.value;
    const carbs = e.target.carbs.value;
    const macros = e.target.macros.value;
    const goals = e.target.goals.value;
  
    const nutritionData = {
      user_id: user.user_id,
      meal: meal,
      protein: protein,
      fat: fat,
      carbs: carbs,
      macros: macros,
      goals: goals
    };
  
    fetch(`/nutrition`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nutritionData),
    })
      .then((response) => {
        if (response.ok) {
          console.log('Nutrition data submitted successfully');
          e.target.reset();
          return response.json(); // Extract the JSON data from the response
        } else {
          throw new Error('Nutrition data submission failed');
        }
      })
      .then((data) => {
        if (!data) {
          throw new Error('Error fetching nutrition data');
        }
        setNutritionData(nutritionData => [...nutritionData, data]);
        console.log(nutritionData); // Use the nutritionData variable if needed
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };
  
  


  const handleMindfulnessSubmit = (e) => {
    e.preventDefault();
    const type = e.target.type.value;
    const duration = e.target.duration.value;
    const notes = e.target.notes.value;
    
  
    const mindfulnessData = {
      user_id: user.user_id,
      type: type,
      duration: duration,
      notes: notes
    };
  
    fetch(`/mindfulness`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mindfulnessData),
    })
      .then((response) => {
        if (response.ok) {
          console.log('Mindfulness data submitted successfully');
          e.target.reset();
          return response.json(); // Extract the JSON data from the response
        } else {
          throw new Error('Mindfulness data submission failed');
        }
      })
      .then((data) => {
        if (!data) {
          throw new Error('Error fetching mindfulness data');
        }
        setMindfulnessData(mindfulnessData => [...mindfulnessData, data]);
        console.log(mindfulnessData); // Use the nutritionData variable if needed
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
 


  return (
    <div className="home">
      <nav className="flex justify-between items-center bg-gray-800 p-6">
        <div>
          <Link to="/" className="text-xl font-bold text-white">Logo</Link>
        </div>
        <div>
          <ul className="flex space-x-4">
            <li>
              <Link to="/dashboard" className="text-white hover:text-gray-300">Dashboard</Link>
            </li>
            <li>
              <Link to="/calender" className="text-white hover:text-gray-300">Calender</Link>
            </li>
            <li>
              <Link to="/about" className="text-white hover:text-gray-300">About</Link>
            </li>
            <li> 
            <Link to="/account" className="text-white hover:text-gray-300">Account</Link>
            </li>
          </ul>
        </div>
      </nav>
      <h1 className="text-3xl font-bold mb-4 mb-4 text-center">Live a Healthier and gain Rewards!</h1>
      {user !== null ? (
        <>
          <h2 className="text-xl font-semibold mb-4 text-center">Healthy lifestyle choice:</h2>
          <div className="health-choice-buttons mb-4 text-center">
            <button
              className={`${
                selectedHealthChoice === 'exercise' ? 'selected' : ''
              } rounded-lg py-2 px-4 mr-2`}
              onClick={() => handleHealthChoiceSelect('exercise')}
            >
              Exercise
            </button>
            <button
              className={`${
                selectedHealthChoice === 'nutrition' ? 'selected' : ''
              } rounded-lg py-2 px-4 mr-2`}
              onClick={() => handleHealthChoiceSelect('nutrition')}
            >
              Nutrition
            </button>
            <button
              className={`${
                selectedHealthChoice === 'mindfulness' ? 'selected' : ''
              } rounded-lg py-2 px-4`}
              onClick={() => handleHealthChoiceSelect('mindfulness')}
            >
              Mindfulness
            </button>
          </div>
          {selectedHealthChoice && (
            <>
              <p className="mt-4">You selected: {selectedHealthChoice}</p>
              <div className="exercise-form">
                <button
                  onClick={() => setSelectedHealthChoice('weightlifting')}
                  className={`${
                    selectedHealthChoice === 'weightlifting' ? 'selected' : ''
                  } rounded-lg py-2 px-4 mr-2`}
                >
                  Weightlifting
                </button>
                <button
                  onClick={() => setSelectedHealthChoice('cardio')}
                  className={`${
                    selectedHealthChoice === 'cardio' ? 'selected' : ''
                  } rounded-lg py-2 px-4`}
                >
                  Cardio
                </button>
                {selectedHealthChoice === 'weightlifting' && (
                  <form onSubmit={handleWeightliftingSubmit} className="mt-4">
                    <label htmlFor="muscleGroup">Muscle Group:</label>
                    <select
                      id="muscleGroup"
                      name="muscleGroup"
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="chest">Chest</option>
                      <option value="back">Back</option>
                      <option value="legs">Legs</option>
                      <option value="biceps">Biceps</option>
                      <option value="triceps">Triceps</option>
                      <option value="shoulders">Shoulders</option>
                    </select>
                    <label htmlFor="duration" className="mt-2">
                      Duration:
                    </label>
                    <input
                      type="text"
                      id="duration"
                      name="duration"
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <label htmlFor="notes" className="mt-2">
                      Notes:
                    </label>
                    <input
                      type="text"
                      id="notes"
                      name="notes"
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <button
                      type="submit"
                      className="mt-4 bg-indigo-500 text-white rounded-lg py-2 px-4"
                    >
                      Submit Weightlifting
                    </button>
                  </form>
                )}
                {selectedHealthChoice === 'cardio' && (
                  <form onSubmit={handleCardioSubmit} className="mt-4">
                    <label htmlFor="duration">Duration:</label>
                    <input
                      type="text"
                      id="duration"
                      name="duration"
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <label htmlFor="distance" className="mt-2">
                      Distance:
                    </label>
                    <input
                      type="text"
                      id="distance"
                      name="distance"
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <label htmlFor="notes" className="mt-2">
                      Notes:
                    </label>
                    <input
                      type="text"
                      id="notes"
                      name="notes"
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <button
                      type="submit"
                      className="mt-4 bg-indigo-500 text-white rounded-lg py-2 px-4"
                    >
                      Submit Cardio
                    </button>
                  </form>
                )}
              </div>
              <div className="nutrition-form">
                {selectedHealthChoice === 'nutrition' && (
                  <form onSubmit={handleNutritionSubmit} className="mt-4">
                    <label htmlFor="meal">Meal:</label>
                    <input
                      type="text"
                      id="meal"
                      name="meal"
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <label htmlFor="protein" className="mt-2">
                      Protein:
                    </label>
                    <input
                      type="text"
                      id="protein"
                      name="protein"
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <label htmlFor="fat" className="mt-2">
                      Fat:
                    </label>
                    <input
                      type="text"
                      id="fat"
                      name="fat"
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <label htmlFor="carbs" className="mt-2">
                      Carbs:
                    </label>
                    <input
                      type="text"
                      id="carbs"
                      name="carbs"
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <label htmlFor="macros" className="mt-2">
                      Macros:
                    </label>
                    <input
                      type="text"
                      id="macros"
                      name="macros"
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <label htmlFor="goals" className="mt-2">
                      Goals:
                    </label>
                    <input
                      type="text"
                      id="goals"
                      name="goals"
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <button
                      type="submit"
                      className="mt-4 bg-indigo-500 text-white rounded-lg py-2 px-4"
                    >
                      Submit Nutrition
                    </button>
                  </form>
                )}
              </div>
              <div className="mindfulness-form">
                {selectedHealthChoice === 'mindfulness' && (
                  <form onSubmit={handleMindfulnessSubmit} className="mt-4">
                    <label htmlFor="type">Activity type:</label>
                    <input
                      type="text"
                      id="type"
                      name="type"
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <label htmlFor="duration" className="mt-2">
                      Duration:
                    </label>
                    <input
                      type="text"
                      id="duration"
                      name="duration"
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <label htmlFor="notes" className="mt-2">
                      Notes:
                    </label>
                    <input
                      type="text"
                      id="notes"
                      name="notes"
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <button
                      type="submit"
                      className="mt-4 bg-indigo-500 text-white rounded-lg py-2 px-4"
                    >
                      Submit Mindfulness
                    </button>
                  </form>
                )}
              </div>

              {exerciseData.length > 0 && (
                <div className="submitted-exercise-data mt-4">
                  <h4 className="font-bold">Exercise Data:</h4>
                  {exerciseData.map((exercise) => (
                    <div key={exercise.id} className="exercise-entry">
                      <p>Muscle Group: {exercise.muscleGroup}</p>
                      <p>Duration: {exercise.duration}</p>
                      <p>Notes: {exercise.notes}</p>
                      <button
                        onClick={handleEdit}
                        className="text-indigo-500 mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={handleDelete}
                        className="text-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </>
      ) : (
        <p>Please log in to access this feature.</p>
      )}
    </div>
  );
};

export default Home;








