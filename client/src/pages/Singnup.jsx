import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';
import { apiClient } from './apiUrl';
import { toast } from 'react-toastify'; 

const Signup = () => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.username || !formData.email || !formData.password) {
      setError(true);
      toast.error('Please fill out all required fields.');
      return;
    }

    try {
      setLoading(true); // Indicate loading state
      setError(false); // Reset error state

      // Make API request
      const { data, status } = await apiClient.post(`/register`, formData);

      // Check for success response
      if (status === 201 && data.success) {
        toast.success('User registered successfully!');
        setLoading(false);

        // Redirect user to sign-in page
        navigate('/createProfile');
      } else {
        setLoading(false);
        setError(true);
        const errorMessage = data.message || 'Failed to register user.';
        toast.error(errorMessage); // Show error feedback
      }
    } catch (error) {
      setLoading(false);
      setError(true);

      // Handle errors gracefully
      const errorMessage =
        error.response?.data?.message ||
        'An error occurred during registration.';
      toast.error(errorMessage);
      console.error('Error during signup:', error); // Log error for debugging
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-blue-400 p-4">
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full sm:w-96 md:w-96 lg:w-96 xl:w-96">
        {/* Title */}
        <h2 className="text-2xl font-bold text-white text-center">
          Create Account
        </h2>
        <p className="text-sm text-gray-400 text-center mt-1">
          Create your account
        </p>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 m-4">
          {/* Full Name */}
          <div className="relative">
            <input
              type="text"
              placeholder="username"
              id="username"
              className="w-full pl-10 py-2 bg-gray-800 text-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 required"
              onChange={handleChange}
            />
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
              <i className="fas fa-user"></i>
            </span>
          </div>

          {/* Email */}
          <div className="relative">
            <input
              type="email"
              placeholder="Email"
              id="email"
              className="w-full pl-10 py-2 bg-gray-800 text-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 required"
              onChange={handleChange}
            />
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
              <i className="fas fa-envelope"></i>
            </span>
          </div>

          {/* Forgot Password */}
          <div className="relative">
            <input
              type="password"
              placeholder="Password"
              id="password"
              className="w-full pl-10 py-2 bg-gray-800 text-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 required"
              onChange={handleChange}
            />

            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
              <i className="fas fa-lock"></i>
            </span>
          </div>

          {/* Sign Up Button */}
          <button
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2 rounded hover:from-purple-600 hover:to-blue-600 transition duration-200"
          >
            {loading ? 'Loading...' : 'Sign Up'}
          </button>
        </form>

        {/* OR Divider */}
        <div className="flex items-center w-full my-4">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-2 text-gray-500 text-sm">OR</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        <OAuth />

        {/* Footer */}
        <p className="text-sm text-gray-400 text-center mt-6">
          Already have an account?{' '}
          <Link to="/" className="text-purple-400 hover:underline">
            Login here
          </Link>
        </p>
        <p className="text-sm text-center text-red-700 mt-5">
          {error ? error.message || 'Something went wrong!' : ''}
        </p>
      </div>
    </div>
  );
};

export default Signup;
