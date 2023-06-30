import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const Exercise = ({handleToggleExercise}) => {
  const [selectedHealthChoice, setSelectedHealthChoice] = useState(null);
  const [exerciseData, setExerciseData] = useState([]);

  useEffect(() => {
    fetch('/exercises')
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Exercise data retrieval failed');
        }
      })
      .then((data) => {
        setExerciseData(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

  const exerciseSchema = Yup.object().shape({
    muscle_group: Yup.string().when('type', {
      is: 'weightlifting',
      then: Yup.string().required('Muscle group is required'),
    }),
    distance: Yup.number().when('type', {
      is: 'cardio',
      then: Yup.number().required('Distance is required'),
    }),
    duration: Yup.number().required('Duration is required'),
    notes: Yup.string(),
  });

  const handlePostSubmit = (values, { resetForm }) => {
    const postData = {
      type: selectedHealthChoice,
      muscle_group: selectedHealthChoice === 'weightlifting' ? values.muscle_group : '',
      distance: selectedHealthChoice === 'cardio' ? values.distance : '',
      duration: values.duration,
      notes: values.notes,
    };

    fetch('/exercises', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    })
      .then((response) => {
        if (response.ok) {
          console.log('Exercise data posted successfully');
          return response.json();
        } else {
          throw new Error('Exercise data posting failed');
        }
      })
      .then((data) => {
        console.log('Exercise Type:', selectedHealthChoice);
        console.log('Exercise Data:', data);

        // Update the postData object with the assigned ID
        const updatedPostData = { ...postData, id: data.id };

        // Update the state with the updated exercise data
        setExerciseData((prevData) => [...prevData, updatedPostData]);

        // Retrieve the updated exercise data
        fetch('/exercises')
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error('Exercise data retrieval failed');
            }
          })
          .then((data) => {
            setExerciseData(data);
          })
          .catch((error) => {
            console.error('Error:', error);
          });

        resetForm();

        // Call the handleToggleExercise function to update the toggle prop
        handleToggleExercise(); // Assuming handleToggleExercise updates the toggle prop
      })
      .catch((error) => {
        console.error('Error posting exercise data:', error);
      });
  };
  
  
  
  const handleDelete = (exerciseId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this exercise?');

    if (!confirmDelete) {
      return;
    }

    fetch(`/exercises/${exerciseId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          console.log('Exercise data deleted successfully');
          // Remove the deleted exercise from the state
          setExerciseData((prevData) =>
            prevData.filter((exercise) => exercise.id !== exerciseId)
          );
        } else {
          throw new Error('Exercise data deletion failed');
        }
      })
      .catch((error) => {
        console.error('Error deleting exercise data:', error);
        // If an error occurs during deletion, revert the state update to maintain consistency
        setExerciseData((prevData) => prevData);
      });
  };
  

  return (
    <div>
      <div className="mb-4">
        <label htmlFor="healthChoice" className="block mb-1 font-medium text-gray-700">
          Choose exercise type:
        </label>
        <span
          className={`${
            selectedHealthChoice === 'weightlifting'
              ? 'bg-indigo-500 text-white'
              : 'bg-gray-200 text-gray-700'
          } rounded-lg py-2 px-4 transition-colors duration-300 ease-in-out hover:bg-indigo-500 hover:text-white focus:outline-none`}
          onClick={() => setSelectedHealthChoice('weightlifting')}
        >
          Weightlifting
        </span>
        <span
          className={`${
            selectedHealthChoice === 'cardio'
              ? 'bg-indigo-500 text-white'
              : 'bg-gray-200 text-gray-700'
          } rounded-lg py-2 px-4 transition-colors duration-300 ease-in-out hover:bg-indigo-500 hover:text-white focus:outline-none ml-2`}
          onClick={() => setSelectedHealthChoice('cardio')}
        >
          Cardio
        </span>
      </div>
      {selectedHealthChoice && (
        <Formik
          initialValues={{
            muscle_group: '',
            distance: '',
            duration: '',
            notes: '',
          }}
          validationSchema={exerciseSchema}
          onSubmit={handlePostSubmit}
        >
          <Form>
            {selectedHealthChoice === 'weightlifting' && (
              <div>
                <div className="mb-4">
                  <label htmlFor="muscle_group" className="block mb-1 font-medium text-gray-700">
                    Muscle group:
                  </label>
                  <Field
                    type="text"
                    name="muscle_group"
                    id="muscle_group"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <ErrorMessage name="muscle_group" component="div" className="text-red-500" />
                </div>
              </div>
            )}
            {selectedHealthChoice === 'cardio' && (
              <div>
                <div className="mb-4">
                  <label htmlFor="distance" className="block mb-1 font-medium text-gray-700">
                    Distance (miles):
                  </label>
                  <Field
                    type="number"
                    name="distance"
                    id="distance"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <ErrorMessage name="distance" component="div" className="text-red-500" />
                </div>
              </div>
            )}
            <div className="mb-4">
              <label htmlFor="duration" className="block mb-1 font-medium text-gray-700">
                Duration (minutes):
              </label>
              <Field
                type="number"
                name="duration"
                id="duration"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <ErrorMessage name="duration" component="div" className="text-red-500" />
            </div>
            <div className="mb-4">
              <label htmlFor="notes" className="block mb-1 font-medium text-gray-700">
                Notes:
              </label>
              <Field
                as="textarea"
                name="notes"
                id="notes"
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <button
                type="submit"
                className="bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600"
              >
                Post
              </button>
            </div>
          </Form>
        </Formik>
      )}
      <div>
        {exerciseData.map((exercise) => (
          <div key={exercise.id} className="border rounded-md p-4 mb-4">
            <div>Type: {exercise.type}</div>
            {exercise.type === 'weightlifting' && <div>Muscle Group: {exercise.muscle_group}</div>}
            {exercise.type === 'cardio' && <div>Distance: {exercise.distance} miles</div>}
            <div>Duration: {exercise.duration} minutes</div>
            {exercise.notes && <div>Notes: {exercise.notes}</div>}
            <button
              className="bg-red-500 text-white py-1 px-2 mt-2 rounded-lg hover:bg-red-600"
              onClick={() => handleDelete(exercise.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Exercise;






















