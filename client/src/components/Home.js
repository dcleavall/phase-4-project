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

    <div className="account-button-container">
            <Link to="/account" className="account-button">
              Account
            </Link>
          </div>
      <h1>Live a Healthier and gain Rewards!</h1>
      {user !== null ? (
        <>

          <h2>Healthy lifestyle choice:</h2>
          <div className="health-choice-buttons">
            <button
              className={selectedHealthChoice === 'exercise' ? 'selected' : ''}
              onClick={() => handleHealthChoiceSelect('exercise')}
            >
              Exercise
            </button>
            <button
              className={selectedHealthChoice === 'nutrition' ? 'selected' : ''}
              onClick={() => handleHealthChoiceSelect('nutrition')}
            >
              Nutrition
            </button>
            <button
              className={selectedHealthChoice === 'mindfulness' ? 'selected' : ''}
              onClick={() => handleHealthChoiceSelect('mindfulness')}
            >
              Mindfulness
            </button>
          </div>
          {selectedHealthChoice && (
            <>
              <p>You selected: {selectedHealthChoice}</p>
              <div className="exercise-form">
                <button
                  onClick={() => setSelectedHealthChoice('weightlifting')}
                  className={selectedHealthChoice === 'weightlifting' ? 'selected' : ''}
                >
                  Weightlifting
                </button>
                <button
                  onClick={() => setSelectedHealthChoice('cardio')}
                  className={selectedHealthChoice === 'cardio' ? 'selected' : ''}
                >
                  Cardio
                </button>
                {selectedHealthChoice === 'weightlifting' && (
                  <form onSubmit={handleWeightliftingSubmit}>
                    <label htmlFor="muscleGroup">Muscle Group:</label>
                    <select id="muscleGroup" name="muscleGroup">
                      <option value="chest">Chest</option>
                      <option value="back">Back</option>
                      <option value="legs">Legs</option>
                      <option value="biceps">Biceps</option>
                      <option value="triceps">Triceps</option>
                      <option value="shoulders">Shoulders</option>
                    </select>
                    <label htmlFor="duration">Duration:</label>
                    <input type="text" id="duration" name="duration" />
                    <label htmlFor="notes">Notes:</label>
                    <input type="text" id="notes" name="notes" />
                    <button type="submit">Submit Weightlifting</button>
                  </form>
                )}
                {selectedHealthChoice === 'cardio' && (
                  <form onSubmit={handleCardioSubmit}>
                    <label htmlFor="duration">Duration:</label>
                    <input type="text" id="duration" name="duration" />
                    <label htmlFor="distance">Distance:</label>
                    <input type="text" id="distance" name="distance" />
                    <label htmlFor="notes">Notes:</label>
                    <input type="text" id="notes" name="notes" />
                    <button type="submit">Submit Cardio</button>
                  </form>
                )}
              </div>
              <div className="nutrition-form">
                {selectedHealthChoice === 'nutrition' && (
                  <form onSubmit={handleNutritionSubmit}>
                    <label htmlFor="meal">Meal:</label>
                    <input type="text" id="meal" name="meal" />
                    <label htmlFor="protein">Protein:</label>
                    <input type="text" id="protein" name="protein" />
                    <label htmlFor="fat">Fat:</label>
                    <input type="text" id="fat" name="fat" />
                    <label htmlFor="carbs">Carbs:</label>
                    <input type="text" id="carbs" name="carbs" />
                    <label htmlFor="macros">Macros:</label>
                    <input type="text" id="macros" name="macros" />
                    <label htmlFor="goals">Goals:</label>
                    <input type="text" id="goals" name="goals" />
                    <button type="submit">Submit Nutrition</button>
                  </form>
                )}
              </div>
              <div className="mindfulness-form">
                {selectedHealthChoice === 'mindfulness' && (
                  <form onSubmit={handleMindfulnessSubmit}>
                    <label htmlFor="type">Activity type:</label>
                    <input type="text" id="type" name="type" />
                    <label htmlFor="duration">Duration:</label>
                    <input type="text" id="duration" name="duration" />
                    <label htmlFor="notes">Notes:</label>
                    <input type="text" id="notes" name="notes" />
                    <button type="submit">Submit Mindfulness</button>
                  </form>
                )}
              </div>


              {exerciseData.length > 0 && (
                <div className="submitted-exercise-data">
                  <h4>Exercise Data:</h4>
                  {exerciseData.map((exercise) => (
                    <div key={exercise.id}>
                      <p>Type: {exercise.type}</p>
                      <p>Duration: {exercise.duration}</p>
                      {exercise.type === 'weightlifting' && (
                        <p>Muscle Group: {exercise.muscle_group}</p>
                      )}
                      {exercise.type === 'cardio' && (
                        <p>Distance: {exercise.distance}</p>
                      )}
                      <p>Notes: {exercise.notes}</p>
                      <button onClick = {handleDelete}>Delete</button>
                      <button onClick = {handleEdit}>Edit</button> 
                      <hr />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default Home;








