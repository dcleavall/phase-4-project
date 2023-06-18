import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = ({ user }) => {
  const [selectedHealthChoice, setSelectedHealthChoice] = useState('');
  const [exerciseData, setExerciseData] = useState([]);

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
  
    // Ensure that user and user.id are available and valid
    if (!user || !user.id) {
      console.error('Invalid user ID');
      return;
    }
  
    // Create an object with the form data
    const cardioData = {
      user_id: user.id,
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

  return (
    <div className="home">
      <h1>Welcome to the Homepage</h1>
      {user !== null ? (
        <>
          <div className="account-button-container">
            <Link to="/account" className="account-button">
              Account
            </Link>
          </div>
          <h2>Select a Health Choice:</h2>
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
          </div>
          {selectedHealthChoice && (
            <>
              <p>You selected: {selectedHealthChoice}</p>
              <div className="exercise-form">
                <h3>Exercise Form</h3>
                <button onClick={() => setSelectedHealthChoice('weightlifting')}>Weightlifting</button>
                <button onClick={() => setSelectedHealthChoice('cardio')}>Cardio</button>
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

              {exerciseData.length > 0 && (
                <div className="submitted-exercise-data">
                  <h4>Persisted Exercise Data:</h4>
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








