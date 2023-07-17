import React, { useState, useContext, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import { ItemTypes } from './ItemTypes';
import { AuthContext } from './UserContext';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { EmojiHappyIcon } from "@heroicons/react/outline";


const Dashboard = () => {
  const [droppedMindfulness, setDroppedMindfulness] = useState({});
  const [commentText, setCommentText] = useState('');
  const [liked, setLiked] = useState(false);
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
    // Save the dropped mindfulness to localStorage
    saveDroppedMindfulnessToLocalStorage(mindfulness);
  };

  // Helper function to save dropped mindfulness to localStorage
  const saveDroppedMindfulnessToLocalStorage = (mindfulnessData) => {
    try {
      localStorage.setItem('droppedMindfulness', JSON.stringify(mindfulnessData));
    } catch (error) {
      console.error('Failed to save dropped mindfulness to localStorage:', error);
    }
  };

  // Helper function to load dropped mindfulness from localStorage
  const loadDroppedMindfulnessFromLocalStorage = () => {
    try {
      const mindfulnessData = localStorage.getItem('droppedMindfulness');
      return mindfulnessData ? JSON.parse(mindfulnessData) : {};
    } catch (error) {
      console.error('Failed to load dropped mindfulness from localStorage:', error);
      return {};
    }
  };

  // Load the dropped mindfulness from localStorage when the component mounts
  useEffect(() => {
    if (!user) {
      // Fetch user data or handle the loading state here
    } else {
      const persistedDroppedMindfulness = loadDroppedMindfulnessFromLocalStorage();
      setDroppedMindfulness(persistedDroppedMindfulness);
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

  const handleComment = () => {
    // You can implement the logic for posting a comment here
    console.log('Posted a comment:', commentText);
    // Clear the comment text box after posting the comment
    setCommentText('');
  };

  const handleLike = () => {
    // You can implement the logic for liking the post here
    setLiked(!liked);
    console.log('Liked the post!');
  };

  return (
    <div className="bg-gray-500 flex flex-col items-center min-h-screen">
      {!user ? (
        <p>Loading user data...</p>
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-4 text-center">Community Thread</h1>
          <div ref={drop} className="container mt-5 mb-5" style={{ ...dropzoneStyle }}>
            <p>Drop mindfulness here</p>
          </div>
          {droppedMindfulness && (
            <div className="mt-4">
              <h2>Dropped Mindfulness:</h2>
              <p>Name: {droppedMindfulness.name}</p>
              <p>Type: {droppedMindfulness.type}</p>
              <p>Duration: {droppedMindfulness.duration}</p>
              <p>Notes: {droppedMindfulness.notes}</p>

              {/* Like Button */}
              <div className="px-4 flex justify-between">
                <button
                  onClick={handleLike}
                  className={`h-4 ${liked ? 'text-red-500' : 'text-gray-500'}`}
                >
                  <FontAwesomeIcon icon={faThumbsUp} />
                </button>
              </div>
              <div className="px-4 truncate flex justify-between">
                <button
                  onClick={handleLike}
                  className={`h-4 ${liked ? 'text-red-500' : 'text-gray-500'}`}
                >
                  <FontAwesomeIcon icon={faThumbsUp} />
                </button>
              </div>
              <hr />

              {/* Comment Textbox */}
              <form className="flex items-center p-4">
                <EmojiHappyIcon className="h-7 mr-2" />
                <input
                  type="text"
                  className="border-none flex-1 focus:ring-0 outline-none"
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <button
                  type="submit"
                  onClick={handleComment}
                  className="font-semibold text-blue-400"
                >
                  Post
                </button>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
