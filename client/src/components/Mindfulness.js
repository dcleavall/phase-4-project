import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useDrag } from 'react-dnd';
import { ItemTypes } from './ItemTypes';

const Mindfulness = ({ handleToggleMindfulness }) => {
  const [mindfulnessData, setMindfulnessData] = useState([]);
  const [selectedMindfulness, setSelectedMindfulness] = useState(null);
  const [showModal, setShowModal] = useState(false);

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
    name: Yup.string().required('Name is required'),
    type: Yup.string().required('Type is required'),
    duration: Yup.number().required('Duration is required'),
    notes: Yup.string().required('Notes is required'),
  });

  const handlePostSubmit = (values, { resetForm }) => {
    const mindfulData = {
      name: values.name,
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
            setMindfulnessData(data);
          })
          .catch((error) => {
            console.error('Error:', error);
          });

        resetForm();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handlePatchSubmit = (values, mindfulnessId, { resetForm }) => {
    const mindfulData = {
      name: values.name,
      type: values.type,
      duration: values.duration,
      notes: values.notes,
    };

    fetch(`/mindfulness/${mindfulnessId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mindfulData),
    })
      .then((response) => {
        if (response.ok) {
          console.log('Mindfulness data updated successfully');
          // Update the mindfulness entry in the state
          setMindfulnessData((prevData) =>
            prevData.map((mindfulness) =>
              mindfulness.id === mindfulnessId ? { ...mindfulness, ...mindfulData } : mindfulness
            )
          );
          resetForm();
          handleToggleMindfulness();
        } else {
          throw new Error('Mindfulness data update failed');
        }
      })
      .catch((error) => {
        console.error('Error updating mindfulness data:', error);
      });
  };

  const handleDelete = (mindfulnessId) => {
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
      });
  };

  const handleEdit = (mindfulness) => {
    setSelectedMindfulness(mindfulness);
    setShowModal(true);
  };

  const MindfulnessItem = ({ mindfulness }) => {
    const [{ isDragging }, dragRef] = useDrag(() => ({
      type: ItemTypes.CARD,
      item: { type: ItemTypes.CARD, mindfulness },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }));

    const opacity = isDragging ? 0.5 : 1;

    return (
      <li style={{ opacity }}>
        <div ref={dragRef} style={{ cursor: 'move' }}>
          <p>Name: {mindfulness.name}</p>
          <p>Type: {mindfulness.type}</p>
          <p>Duration: {mindfulness.duration}</p>
          <p>Notes: {mindfulness.notes}</p>
        </div>
        <button
          className="bg-red-500 text-white py-1 px-2 mt-2 rounded-lg hover:bg-red-600"
          onClick={() => handleDelete(mindfulness.id)}
        >
          Delete
        </button>
        <Button variant="info" onClick={() => handleEdit(mindfulness)}>
          Edit
        </Button>
      </li>
    );
  };

  return (
    <div>
      <Formik
        initialValues={{
          name: '',
          type: '',
          duration: '',
          notes: '',
        }}
        validationSchema={mindfulnessSchema}
        onSubmit={(values, { resetForm }) => {
          if (selectedMindfulness) {
            handlePatchSubmit(values, selectedMindfulness.id, { resetForm });
          } else {
            handlePostSubmit(values, { resetForm });
          }
        }}
      >
        {({ resetForm }) => (
          <Form>
            {/* Form fields */}
            <div className="mb-4">
              <label htmlFor="name" className="block mb-1 font-medium text-gray-700">
                Name:
              </label>
              <Field
                type="text"
                name="name"
                id="name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <ErrorMessage name="name" component="div" className="text-red-500" />
            </div>
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
              <Button variant="primary" type="submit">
                {selectedMindfulness ? 'Update' : 'Post'}
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  resetForm();
                  setSelectedMindfulness(null);
                  setShowModal(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </Form>
        )}
      </Formik>

      {/* Render mindfulness data */}
      <div className="border rounded-md p-4 mb-4">
        <h2 className="text-lg font-semibold mb-4">Mindfulness Data</h2>
        {mindfulnessData.length > 0 ? (
          <ul>
            {mindfulnessData.map((mindfulness) => (
              <MindfulnessItem mindfulness={mindfulness} key={mindfulness.id} />
            ))}
          </ul>
        ) : (
          <p>No mindfulness data available.</p>
        )}
      </div>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Mindfulness</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{
              name: selectedMindfulness ? selectedMindfulness.name : '',
              type: selectedMindfulness ? selectedMindfulness.type : '',
              duration: selectedMindfulness ? selectedMindfulness.duration : '',
              notes: selectedMindfulness ? selectedMindfulness.notes : '',
            }}
            validationSchema={mindfulnessSchema}
            onSubmit={(values, { resetForm }) => {
              handlePatchSubmit(values, selectedMindfulness.id, { resetForm });
            }}
          >
            {({ resetForm }) => (
              <Form>
                {/* Form fields */}
                <div className="mb-4">
                  <label htmlFor="name" className="block mb-1 font-medium text-gray-700">
                    Name:
                  </label>
                  <Field
                    type="text"
                    name="name"
                    id="name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <ErrorMessage name="name" component="div" className="text-red-500" />
                </div>
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
                  <Button variant="primary" type="submit">
                    Update
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      resetForm();
                      setSelectedMindfulness(null);
                      setShowModal(false);
                    }}
                  >
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

export default Mindfulness;
