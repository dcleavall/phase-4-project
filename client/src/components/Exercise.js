import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const exerciseSchema = Yup.object().shape({
  type: Yup.string().required('Exercise type is required'),
  duration: Yup.number().required('Duration is required'),
  notes: Yup.string().required('Notes are required'),
});

const Exercise = ({ handleToggleExercise }) => {
  const [exerciseData, setExerciseData] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [showExercise, setShowExercise] = useState(false);

  useEffect(() => {
    // Fetch exercise data from the server or any other data source
    // and set it to the exerciseData state variable
  }, []);

  const handlePost = (exercise) => {
    setExerciseData((prevExerciseData) => [...prevExerciseData, exercise]);
    setShowExercise(false);
  };

  const handleEdit = (exercise) => {
    setExerciseData((prevExerciseData) =>
      prevExerciseData.map((ex) => (ex.id === exercise.id ? exercise : ex))
    );
    setSelectedExercise(null);
    setShowExercise(false);
  };

  const handleDelete = (exerciseId) => {
    setExerciseData((prevExerciseData) =>
      prevExerciseData.filter((ex) => ex.id !== exerciseId)
    );
  };

  const getValidationSchema = (type) => {
    switch (type) {
      case 'cardio':
        return exerciseSchema.concat(
          Yup.object({
            distance: Yup.number().required('Distance is required'),
          })
        );
      case 'weightlifting':
        return exerciseSchema.concat(
          Yup.object({
            muscle_group: Yup.string().required('Muscle group is required'),
          })
        );
      default:
        return exerciseSchema;
    }
  };

  return (
    <div>
      <h1>Exercise Component</h1>

      {/* Button to toggle the exercise form modal */}
      <Button variant="primary" onClick={() => setShowExercise(true)}>
        Add Exercise
      </Button>

      {/* Exercise Form Modal */}
      <Modal show={showExercise} onHide={() => setShowExercise(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Exercise Form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{
              id: selectedExercise ? selectedExercise.id : '',
              type: selectedExercise ? selectedExercise.type : '',
              muscle_group: selectedExercise ? selectedExercise.muscle_group : '',
              distance: selectedExercise ? selectedExercise.distance : '',
              duration: selectedExercise ? selectedExercise.duration : '',
              notes: selectedExercise ? selectedExercise.notes : '',
            }}
            validationSchema={Yup.lazy((values) =>
              getValidationSchema(values.type)
            )}
            onSubmit={(values, { resetForm }) => {
              if (selectedExercise) {
                handleEdit(values);
              } else {
                handlePost(values);
              }
              resetForm();
            }}
          >
            {({ values, setFieldValue, resetForm }) => (
              <Form>
                {/* Exercise Type */}
                <div>
                  <label>
                    <Field
                      type="radio"
                      name="type"
                      value="cardio"
                      checked={values.type === 'cardio'}
                      onChange={() => setFieldValue('type', 'cardio')}
                    />
                    Cardio
                  </label>
                  <label>
                    <Field
                      type="radio"
                      name="type"
                      value="weightlifting"
                      checked={values.type === 'weightlifting'}
                      onChange={() => setFieldValue('type', 'weightlifting')}
                    />
                    Weightlifting
                  </label>
                  <ErrorMessage name="type" component="div" className="error" />
                </div>

                {/* Additional Fields */}
                {values.type === 'weightlifting' && (
                  <div>
                    <label htmlFor="muscle_group">Muscle Group:</label>
                    <Field type="text" name="muscle_group" />
                    <ErrorMessage
                      name="muscle_group"
                      component="div"
                      className="error"
                    />
                  </div>
                )}

                {values.type === 'cardio' && (
                  <div>
                    <label htmlFor="distance">Distance:</label>
                    <Field type="number" name="distance" />
                    <ErrorMessage
                      name="distance"
                      component="div"
                      className="error"
                    />
                  </div>
                )}

                {/* Duration */}
                <div>
                  <label htmlFor="duration">Duration (in minutes):</label>
                  <Field type="number" name="duration" />
                  <ErrorMessage
                    name="duration"
                    component="div"
                    className="error"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label htmlFor="notes">Notes:</label>
                  <Field as="textarea" name="notes" />
                  <ErrorMessage name="notes" component="div" className="error" />
                </div>

                {/* Submit Button */}
                <div>
                  <Button variant="primary" type="submit">
                    {selectedExercise ? 'Update Exercise' : 'Add Exercise'}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>

      {/* Exercise List */}
      <ul>
        {exerciseData.map((exercise) => (
          <li key={exercise.id}>
            {exercise.type}
            <Button variant="link" onClick={() => setSelectedExercise(exercise)}>
              Edit
            </Button>
            <Button variant="link" onClick={() => handleDelete(exercise.id)}>
              Delete
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Exercise;
