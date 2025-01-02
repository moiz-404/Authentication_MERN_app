import React from 'react';
import { toast } from 'react-toastify'; 

const ResetPassword = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-purple-300 to-purple-500">
      <div className="bg-gray-900 text-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-2xl font-bold text-center mb-2">Reset password</h2>
        <p className="text-sm text-gray-400 text-center mb-6">
          Enter your registered email address
        </p>

        <form>
          <div className="relative mb-6">
            <label
              htmlFor="email"
              className="absolute left-3 top-2/4 -translate-y-2/4 text-gray-400"
            >
              📧
            </label>
            <input
              type="email"
              id="email"
              placeholder="Email id"
              className="w-full pl-10 pr-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-2 rounded-lg hover:opacity-90 transition"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
