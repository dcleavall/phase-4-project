import React, { useState } from 'react';

const Blog = () => {
  const [title, setTitle] = useState();
  const [content, setContent] = useState(
   'Add content here');

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-3xl font-semibold text-gray-800">{title}</h1>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <article className="bg-white shadow-md rounded-lg p-6 mb-8">
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              className="text-2xl font-semibold text-gray-800 mb-4 w-full p-2 rounded"
              placeholder="Enter blog post title"
            />
            <textarea
              value={content}
              onChange={handleContentChange}
              className="text-gray-700 mb-4 w-full p-2 rounded"
              rows="8"
              placeholder="Enter blog post content"
            />
          </article>
        </div>
      </main>
    </div>
  );
};

export default Blog;

