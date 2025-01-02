// src/NotFound.jsx
import React from 'react';

const NotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-6xl font-bold text-red-500">404</h1>
        <p className="text-xl mt-4 text-gray-700">
          Oops! The page you're looking for doesn't exist.
        </p>
        <a href="/" className="mt-6 inline-block text-blue-500 hover:text-blue-700">
          Go back to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
