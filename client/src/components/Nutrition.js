import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Nutrition = ({ handleToggleNutrition }) => {
  const [nutritionData, setNutritionData] = useState([]);
  const [selectedNutrition, setSelectedNutrition] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch('/nutrition')
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Nutrition data retrieval failed');
        }
      })
      .then((data) => {
        setNutritionData(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

  const nutritionSchema = Yup.object().shape({
    meal: Yup.string().required('Meal is required'),
    protein: Yup.number().required('Protein is required'),
    carbs: Yup.number().required('Carbs is required'),
    fat: Yup.number().required('Fat is required'),
    macros: Yup.number().required('Macros is required'),
    goals: Yup.string().required('Goals is required'),
  });

  const handlePostSubmit = (values, { resetForm }) => {
    const nutrData = {
      meal: values.meal,
      protein: values.protein,
      carbs: values.carbs,
      fat: values.fat,
      macros: values.macros,
      goals: values.goals,
    };

    fetch('/nutrition', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nutrData),
    })
      .then((response) => {
        if (response.ok) {
          console.log('Nutrition data posted successfully');
          return response.json();
        } else {
          throw new Error('Nutrition data posting failed');
        }
      })
      .then((data) => {
        console.log('Nutrition Data:', data);
        resetForm();

        // Retrieve the updated nutrition data
        fetch('/nutrition')
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error('Nutrition data retrieval failed');
            }
          })
          .then((data) => {
            console.log('Nutrition Data:', data);

            const updatedNutrData = { ...nutrData, id: data.id };

            setNutritionData((prevData) => [...prevData, updatedNutrData]);

            fetch('/nutrition')
              .then((response) => {
                if (response.ok) {
                  return response.json();
                } else {
                  throw new Error('Nutrition data retrieval failed');
                }
              })
              .then((data) => {
                setNutritionData(data);
              })
              .catch((error) => {
                console.error('Error:', error);
              });

            resetForm();

            handleToggleNutrition();
          })

          .catch((error) => {
            console.error('Error:', error);
          });
      });
    };

  const handlePatchSubmit = (values, nutritionId, { resetForm }) => {
    const nutrData = {
      meal: values.meal,
      protein: values.protein,
      carbs: values.carbs,
      fat: values.fat,
      macros: values.macros,
      goals: values.goals,
    };

    fetch(`/nutrition/${nutritionId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(nutrData),
      })

      .then((response) => {
        if (response.ok) {
          console.log('Nutrition data updated successfully');
          setNutritionData((prevData) =>
            prevData.map((nutrition) => 
              nutrition.id === nutritionId ? { ...nutrition, ...nutrData} : nutrition
            )
          );
          resetForm();
          handleToggleNutrition();
        } else {
          throw new Error('Nutrition data update failed');
        }
      })
      .catch((error) => {
        console.error('Error updating nutrition data:', error);
      });
  };

  const handleDelete = (nutritionId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this nutrition?');
  
    if (!confirmDelete) {
      return;
    }
  
    fetch(`/nutrition/${nutritionId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          console.log('Nutrition data deleted successfully');
          // Remove the deleted nutrition from the state
          setNutritionData((prevData) =>
            prevData.filter((nutrition) => nutrition.id !== nutritionId)
          );
        } else {
          throw new Error('Nutrition data deletion failed');
        }
      })
      .catch((error) => {
        console.error('Error deleting nutrition data:', error);
        // If an error occurs during deletion, revert the state update to maintain consistency
        setNutritionData((prevData) => prevData);
      });
  };

  const handleEdit = (nutrition) => {
    setSelectedNutrition(nutrition);
    setShowModal(true);
  };
  


  return (
    <div>
      <Formik
        initialValues={{
          meal: '',
          protein: '',
          carbs: '',
          fat: '',
          macros: '',
          goals: '',
        }}
        validationSchema={nutritionSchema}
        onSubmit={(values, {resetForm}) => {
          if (selectedNutrition) {
            handlePatchSubmit(values, selectedNutrition.id, {resetForm});
          } else {
            handlePostSubmit(values, {resetForm});
          }
        }}
      >
        {({ resetForm }) =>  (
          <Form>
            {/* Form fields */}
            <div className="mb-4">
              <label htmlFor="meal" className="block mb-1 font-medium text-gray-700">
                Meal:
              </label>
              <Field
                type="text"
                name="meal"
                id="meal"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <ErrorMessage name="meal" component="div" className="text-red-500" />
            </div>

            <div className="mb-4">
              <label htmlFor="protein" className="block mb-1 font-medium text-gray-700">
                Protein:
              </label>
              <Field
                type="text"
                name="protein"
                id="protein"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <ErrorMessage name="protein" component="div" className="text-red-500" />
            </div>

            <div className="mb-4">
              <label htmlFor="carbs" className="block mb-1 font-medium text-gray-700">
                Carbs:
              </label>
              <Field
                type="text"
                name="carbs"
                id="carbs"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <ErrorMessage name="carbs" component="div" className="text-red-500" />
            </div>

            <div className="mb-4">
              <label htmlFor="fat" className="block mb-1 font-medium text-gray-700">
                Fat:
              </label>
              <Field
                type="text"
                name="fat"
                id="fat"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <ErrorMessage name="fat" component="div" className="text-red-500" />
            </div>

            <div className="mb-4">
              <label htmlFor="macros" className="block mb-1 font-medium text-gray-700">
                Macros:
              </label>
              <Field
                type="text"
                name="macros"
                id="macros"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <ErrorMessage name="macros" component="div" className="text-red-500" />
            </div>

            <div className="mb-4">
              <label htmlFor="goals" className="block mb-1 font-medium text-gray-700">
                Goals:
              </label>
              <Field
                type="text"
                name="goals"
                id="goals"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <ErrorMessage name="goals" component="div" className="text-red-500" />
            </div>

            <div className="mb-4">
              <Button variant="primary" type="submit">
                  {selectedNutrition ? 'Update' : 'Post'}
              </Button>
              <Button variant="secondary" onClick={() => {
                  resetForm();
                  setSelectedNutrition(null);
                  setShowModal(false);
                }}>
                  Cancel
              </Button>
            </div>
          </Form>
        )}
      </Formik>

        {/* Render nutrition data */}
        <div className="border rounded-md p-4 mb-4">
          <h2 className="text-lg font-semibold mb-4">Nutrition Data</h2>
          {nutritionData.length > 0 ? (
            <ul>
              {nutritionData.map((nutrition) => (
                <li key={nutrition.id}>
                  <p>Meal: {nutrition.meal}</p>
                  <p>Protein: {nutrition.protein}</p>
                  <p>Carbs: {nutrition.carbs}</p>
                  <p>Fat: {nutrition.fat}</p>
                  <p>Macros: {nutrition.macros}</p>
                  <p>Goals: {nutrition.goals}</p>
                  <button
                  className="bg-red-500 text-white py-1 px-2 mt-2 rounded-lg hover:bg-red-600"
                  onClick={() => handleDelete(nutrition.id)}
                  >
                  Delete
                  </button>
                  <Button variant="info" onClick={() => handleEdit(nutrition)}>
                  Edit
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No nutrition data available.</p>
          )}
        </div>
        {/* Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Nutrition</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Formik
              initialValues={{
                meal: selectedNutrition ? selectedNutrition.meal : '',
                protein: selectedNutrition ? selectedNutrition.protein : '',
                carbs: selectedNutrition ? selectedNutrition.carbs : '',
                fat: selectedNutrition ? selectedNutrition.fat : '',
                macros: selectedNutrition ? selectedNutrition.macros : '',
                goals: selectedNutrition ? selectedNutrition.goals : '',
              
              }}
              validationSchema={nutritionSchema}
              onSubmit={(values, { resetForm }) => {
                handlePatchSubmit(values, selectedNutrition.id, { resetForm });
              }}
            >
              {({ resetForm }) => (
                <Form>
                  {/* Form fields */}
                  <div className="mb-4">
                    <label htmlFor="meal" className="block mb-1 font-medium text-gray-700">
                      Meal:
                    </label>
                    <Field
                      type="text"
                      name="meal"
                      id="meal"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <ErrorMessage name="meal" component="div" className="text-red-500" />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="protein" className="block mb-1 font-medium text-gray-700">
                      Protein:
                    </label>
                    <Field
                      type="text"
                      name="protein"
                      id="protein"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <ErrorMessage name="protein" component="div" className="text-red-500" />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="carbs" className="block mb-1 font-medium text-gray-700">
                      Carbs:
                    </label>
                    <Field
                      type="text"
                      name="carbs"
                      id="carbs"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <ErrorMessage name="carbs" component="div" className="text-red-500" />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="fat" className="block mb-1 font-medium text-gray-700">
                      Fat:
                    </label>
                    <Field
                      type="text"
                      name="fat"
                      id="fat"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <ErrorMessage name="fat" component="div" className="text-red-500" />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="macros" className="block mb-1 font-medium text-gray-700">
                      Macros:
                    </label>
                    <Field
                      type="text"
                      name="macros"
                      id="macros"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <ErrorMessage name="macros" component="div" className="text-red-500" />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="goals" className="block mb-1 font-medium text-gray-700">
                      Goals:
                    </label>
                    <Field
                      type="text"
                      name="goals"
                      id="goals"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <ErrorMessage name="goals" component="div" className="text-red-500" />
                  </div>

                  <div className="mb-4">
                    <Button variant="primary" type="submit">
                      Update
                    </Button>
                    <Button variant="secondary" onClick={() => {
                      resetForm();
                      setSelectedNutrition(null);
                      setShowModal(false);
                    }}>
                      Cancel
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </Modal.Body>
        </Modal>

      </div>
  );
};

export default Nutrition;



