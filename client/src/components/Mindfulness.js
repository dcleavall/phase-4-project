import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const Mindfulness = ({ handleToggleMindfulness }) => {
  const [mindfulnessData, setMindfulnessData] = useState([]);

  useEffect(() => {
    fetch('/mindfulness')
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Mindfulness data retrieval failed');
        }
      })
      .then((data) => {
        setMindfulnessData(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

  const mindfulnessSchema = Yup.object().shape({
    type: Yup.string().required('Type is required'),
    duration: Yup.number().required('Duration is required'),
    notes: Yup.string().required('Notes is required'),
  });

  const handlePostSubmit = (values, { resetForm }) => {
    const mindfulData = {
      type: values.type,
      duration: values.duration,
      notes: values.notes,
    };

    fetch('/mindfulness', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mindfulData),
    })
      .then((response) => {
        if (response.ok) {
          console.log('Mindfulness data posted successfully');
          return response.json();
        } else {
          throw new Error('Mindfulness data posting failed');
        }
      })
      .then((data) => {
        console.log('Mindfulness Data:', data);
        resetForm();

        // Retrieve the updated mindfulness data
        fetch('/mindfulness')
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error('Mindfulness data retrieval failed');
            }
          })
          .then((data) => {
            console.log('Mindfulness Data:', data);

            const updatedMindfulnessData = { ...mindfulnessData, id: data.id };

            setMindfulnessData((prevData) => [...prevData, updatedMindfulnessData]);

            fetch('/mindfulness')
              .then((response) => {
                if (response.ok) {
                  return response.json();
                } else {
                  throw new Error('Mindfulness data retrieval failed');
                }
              })
              .then((data) => {
                setMindfulnessData(data);
              })
              .catch((error) => {
                console.error('Error:', error);
              });

            resetForm();

            handleToggleMindfulness();
          })

          .catch((error) => {
            console.error('Error:', error);
          });
      });
  };

  const handleDelete = (mindfulnessId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this mindfulness entry?');

    if (!confirmDelete) {
      return;
    }

    fetch(`/mindfulness/${mindfulnessId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          console.log('Mindfulness data deleted successfully');
          // Remove the deleted mindfulness entry from the state
          setMindfulnessData((prevData) =>
            prevData.filter((mindfulness) => mindfulness.id !== mindfulnessId)
          );
        } else {
          throw new Error('Mindfulness data deletion failed');
        }
      })
      .catch((error) => {
        console.error('Error deleting mindfulness data:', error);
        // If an error occurs during deletion, revert the state update to maintain consistency
        setMindfulnessData((prevData) => prevData);
      });
  };

  return (
    <div>
      <Formik
        initialValues={{
          technique: '',
          duration: '',
          description: '',
        }}
        validationSchema={mindfulnessSchema}
        onSubmit={handlePostSubmit}
      >
        <Form>
          {/* Form fields */}
          <div className="mb-4">
            <label htmlFor="type" className="block mb-1 font-medium text-gray-700">
              Type:
            </label>
            <Field
              type="text"
              name="type"
              id="type"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <ErrorMessage name="type" component="div" className="text-red-500" />
          </div>

          <div className="mb-4">
            <label htmlFor="duration" className="block mb-1 font-medium text-gray-700">
              Duration:
            </label>
            <Field
              type="text"
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
              type="text"
              name="notes"
              id="notes"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <ErrorMessage name="notes" component="div" className="text-red-500" />
          </div>

          <div className="mb-4">
            <button
              type="submit"
              className="bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600"
            >
              Post
            </button>
            <button
              type="button"
              onClick={handleToggleMindfulness}
              className="bg-gray-300 text-gray-700 py-2 px-4 ml-2 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </Form>
      </Formik>

      {/* Render mindfulness data */}
      <div className="border rounded-md p-4 mb-4">
        <h2 className="text-lg font-semibold mb-4">Mindfulness Data</h2>
        {mindfulnessData.length > 0 ? (
          <ul>
            {mindfulnessData.map((mindfulness) => (
              <li key={mindfulness.id}>
                <p>Type: {mindfulness.type}</p>
                <p>Duration: {mindfulness.duration}</p>
                <p>Notes: {mindfulness.notes}</p>
                <button
                  className="bg-red-500 text-white py-1 px-2 mt-2 rounded-lg hover:bg-red-600"
                  onClick={() => handleDelete(mindfulness.id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No mindfulness data available.</p>
        )}
      </div>
    </div>
  );
};

export default Mindfulness;
