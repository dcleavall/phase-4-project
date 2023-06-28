import React, { useState } from 'react';

const Noteboard = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handlePost = () => {
    // Handle the blog post submission logic here
    console.log('Note posted');
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      <header className="shadow py-6 flex justify-center items-center w-full">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-semibold">Noteboard</h1>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gray-800 shadow-md rounded-lg p-6 mb-8">
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              className="text-2xl font-semibold text-gray-100 bg-gray-700 mb-4 w-full p-2 rounded"
              placeholder="Give a title to your note..."
            />
            <textarea
              value={content}
              onChange={handleContentChange}
              className="text-gray-100 bg-gray-700 mb-4 w-full p-2 rounded"
              rows="8"
              placeholder="Content goes here..."
            />
            <div className="flex justify-end">
              <button
                onClick={handlePost}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Noteboard;






