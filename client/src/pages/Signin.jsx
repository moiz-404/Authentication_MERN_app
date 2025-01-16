import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../redux/user/userSlice';
import OAuth from '../components/OAuth';
import { toast } from 'react-toastify';
import { apiClient } from './apiUrl';

const Signin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form fields
    if (!formData.email || !formData.password) {
      dispatch(
        signInFailure({ message: 'Both email and password are required.' }),
      );
      toast.error('Both email and password are required.'); // Added user feedback
      return;
    }

    try {
      dispatch(signInStart()); // Set loading state

      // Make the POST request using apiClient
      const { data } = await apiClient.post('/login', formData);

      if (!data.success) {
        // Handle any unexpected failures from the backend
        dispatch(signInFailure({ message: data.message || 'Sign-in failed.' }));
        toast.error(data.message || 'Sign-in failed. Please try again.');
      }
      dispatch(signInSuccess(data)); // On success, store user data
      navigate('/home');
      toast.success('Successfully signed in!');
    } catch (err) {
      // Dispatch failure action with a user-friendly error message
      dispatch(
        signInFailure({
          message:
            err.response?.data?.message ||
            'An error occurred. Please try again later.',
        }),
      );
      toast.error(
        err.response?.data?.message ||
          'An error occurred. Please try again later.',
      );
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-b from-purple-200 to-purple-300">
      <div className="w-96 bg-gray-900 rounded-lg shadow-lg p-8 text-white">
        <h1 className="text-3xl font-bold text-center mb-2">Login</h1>
        <p className="text-center text-gray-400 mb-6">Login to your account!</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-gray-300 mb-1">
              Email
            </label>
            <div className="flex items-center bg-gray-800 rounded-md px-3 py-2">
              <span className="mr-2 text-gray-400">📧</span>
              <input
                type="email"
                id="email"
                placeholder="Email"
                className="bg-transparent focus:outline-none w-full text-gray-200 placeholder-gray-400"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-gray-300 mb-1">
              Password
            </label>
            <div className="flex items-center bg-gray-800 rounded-md px-3 py-2">
              <span className="mr-2 text-gray-400">🔒</span>
              <input
                type="password"
                id="password"
                placeholder="Password"
                className="bg-transparent focus:outline-none w-full text-gray-200 placeholder-gray-400"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <a href="#" className="text-sm text-blue-400 hover:underline">
              Forgot password?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-400 text-white font-medium py-2 rounded-full shadow-lg hover:opacity-90"
          >
            {loading ? 'Loading...' : 'Sign In'}
          </button>
        </form>

        {/* Error Message */}
        {error?.message && (
          <p className="text-sm text-center text-red-700 mt-4">
            {error.message}
          </p>
        )}

        {/* OR Divider */}
        <div className="flex items-center w-full my-4">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-2 text-gray-500 text-sm">OR</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        <OAuth />

        {/* Sign Up Option */}
        <p className="text-center text-gray-400 mt-4 text-sm">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-400 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signin;
