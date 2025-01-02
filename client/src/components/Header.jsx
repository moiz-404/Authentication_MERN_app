import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <header className="bg-gradient-to-b from-pink-100 to-white shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center p-4 md:p-6">
        {/* Logo Section */}
        <div>
          <Link to="/home">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="flex items-center">
                <div className="size-3 bg-blue-500 rounded-sm"></div>
                <div className="size-3 bg-blue-400 rounded-sm ml-1"></div>
                <div className="size-3 bg-blue-300 rounded-sm ml-1"></div>
              </div>
              <h1 className="ml-2 text-xl font-bold text-gray-900">auth</h1>
            </div>
          </Link>
        </div>

        {/* Navigation Section */}
        <nav className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-20">
          <ul className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
            <Link
              to="/home"
              className="text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200"
            >
              <li>Home</li>
            </Link>
            <Link
              to="/profile"
              className="text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200"
            >
              <li>Profile</li>
            </Link>
            <Link to="/profile">
              {currentUser ? (
                <img
                  src={currentUser.profilePicture}
                  alt="profile"
                  className="h-7 w-7 rounded-full object-cover"
                />
              ) : (
                <li>Sign In</li>
              )}
            </Link>
          </ul>
          {/* <button className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 font-medium border border-gray-300 px-4 py-2 rounded-full shadow-sm hover:bg-gray-100 transition-colors duration-200">
            <span>&larr;</span> Login
          </button> */}
        </nav>
      </div>
    </header>
  );
};

export default Header;
