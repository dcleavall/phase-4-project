import React, { useState, useContext, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import { ItemTypes } from './ItemTypes';
import { AuthContext } from './UserContext';
import { useHistory } from 'react-router-dom';

const Dashboard = () => {
  const [droppedMindfulness, setDroppedMindfulness] = useState(null);
  const { user } = useContext(AuthContext);
  const history = useHistory();

  const handleDrop = (item) => {
    if (!user) {
      console.error('User is not authenticated. Cannot add to dashboard.');
      return;
    }

    // Retrieve the dropped mindfulness data
    const { mindfulness } = item;

    // Make an API call to add the new dashboard entry to the backend using fetch
    fetch('/dashboard', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: user.id, // Pass the user ID to the backend
        name: mindfulness.name, // Use the mindfulness name as the dashboard name
        type: mindfulness.type, // Add the mindfulness type
        duration: mindfulness.duration, // Add the mindfulness duration
        notes: mindfulness.notes, // Add the mindfulness notes
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to add dashboard entry to the backend');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Dashboard entry added to the backend:', data);
        // You can update the state or perform any additional actions if needed.
        // For example, you might want to update the list of dashboards displayed in the frontend.
      })
      .catch((error) => {
        console.error(error);
      });

    // Update the state with the dropped mindfulness
    setDroppedMindfulness(mindfulness);
  };

  // ... (existing code)

  useEffect(() => {
    if (!user) {
      // Fetch user data or handle the loading state here
    } else {
      // Fetch the dropped mindfulness data from the backend using fetch
      fetch('/mindfulness')
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch dropped mindfulness data');
          }
          return response.json();
        })
        .then((data) => {
          // Update the state with the dropped mindfulness data
          setDroppedMindfulness(data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [user]);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.CARD,
    drop: (item) => {
      // Call handleDrop inside the drop function
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
    <div className="bg-gray-500 flex flex-col items-center min-h-screen">
      {!user ? (
        <p>Loading user data...</p>
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-4 text-center">Community Thread</h1>
          <div ref={drop} style={dropzoneStyle}>
            <p>Drop mindfulness here</p>
          </div>
          {droppedMindfulness && (
            <div className="mt-4">
              <h2>Dropped Mindfulness:</h2>
              <p>Name: {droppedMindfulness.name}</p>
              <p>Type: {droppedMindfulness.type}</p>
              <p>Duration: {droppedMindfulness.duration}</p>
              <p>Notes: {droppedMindfulness.notes}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
