import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { signOut } from '../redux/user/userSlice';

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(signOut());
    navigate('/signin');
  };

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
        <nav>
          <ul className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
            <li>
              <Link to="/home" className="text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200">
                Home
              </Link>
            </li>
            <li>
              <Link to="/profile" className="text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200">
                Profile
              </Link>
            </li>
            <li>
              {currentUser ? (
                <button onClick={handleLogout} className="flex items-center space-x-2">
                  <img
                    src={currentUser.profilePicture || '/default-avatar.png'}
                    alt="profile"
                    className="h-7 w-7 rounded-full object-cover"
                  />
                  <span className="text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200">Logout</span>
                </button>
              ) : (
                <Link to="/signin" className="text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200">
                  Sign In
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
