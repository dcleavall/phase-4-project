import React, { useState, useContext, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import { ItemTypes } from './ItemTypes';
import { AuthContext } from './UserContext';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';


const Dashboard = () => {
  const [droppedMindfulness, setDroppedMindfulness] = useState({});
  const [commentText, setCommentText] = useState('');
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
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
        user_id: user.id,
        username: user.username, // Use the logged-in user's username
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

        // Update the state with the dropped mindfulness and include the username
        const droppedMindfulnessWithUsername = {
          ...mindfulness,
          username: user.username,
        };
        setDroppedMindfulness(droppedMindfulnessWithUsername);

        // Save the dropped mindfulness to localStorage
        saveDroppedMindfulnessToLocalStorage(droppedMindfulnessWithUsername);
      })
      .catch((error) => {
        console.error(error);
      });
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

  const handleLike = (e) => {
    e.preventDefault();
    if (!user) {
      console.error('User is not authenticated. Cannot like the post.');
      return;
    }

    // Make an API call to update the likes on the backend
    fetch(`/dashboard/${droppedMindfulness.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        liked: !liked, // Send the opposite of the current 'liked' state
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to update likes on the backend');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Likes updated on the backend:', data);

        // Update the liked state directly without using preventDefault or form submission
        setLiked(!liked);
        localStorage.setItem('liked', (!liked).toString()); // Store the liked state as a string in local storage

        // Update the like count based on the response from the backend
        setLikeCount(data.likeCount);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="bg-gray-500 flex flex-col items-center min-h-screen">
      {!user ? (
        <p>Loading user data...</p>
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-4 text-center">Community Thread</h1>
          <div ref={drop} className="container mt-5 mb-5" style={{ ...dropzoneStyle }}>
            <p>Drop health item</p>
          </div>
          {droppedMindfulness && (
            <div className="mt-4">
              <h2>{droppedMindfulness.username}, posted:</h2>
              <p>Name: {droppedMindfulness.name}</p>
              <p>Type: {droppedMindfulness.type}</p>
              <p>Duration: {droppedMindfulness.duration}</p>
              <p>Notes: {droppedMindfulness.notes}</p>
              
              <form className="flex items-center p-4">
                <div className="px-4 flex justify-between">
                  <button
                    onClick={handleLike}
                    className={`h-4 ${liked ? 'text-blue-500' : 'text-black-500'}`}
                  >
                    <FontAwesomeIcon icon={faThumbsUp} />
                  </button>
                  <span className="text-sm ml-2">{likeCount}</span>
                </div>
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