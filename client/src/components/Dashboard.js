import React, { useState, useContext, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import { ItemTypes } from './ItemTypes';
import { AuthContext } from './UserContext';
import { useHistory } from 'react-router-dom';

const Dashboard = () => {
  const [droppedMindfulness, setDroppedMindfulness] = useState(null);
  const { user } = useContext(AuthContext);
  const history = useHistory();

  useEffect(() => {
    if (!user) {
      // Fetch user data or handle the loading state here
    }
  }, [user]);

  const handleDrop = (item) => {
    // Retrieve the dropped mindfulness data
    const { mindfulness } = item;
    // Update the state with the dropped mindfulness
    setDroppedMindfulness(mindfulness);
    console.log(mindfulness);
  };


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
