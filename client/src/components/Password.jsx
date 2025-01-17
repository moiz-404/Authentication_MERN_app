import { apiClient } from '../pages/apiUrl';
import { useSelector, useDispatch } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import app from '../firebase';
import {
  getUserStart,
  getUserSuccess,
  getUserFailure,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  updateProfileSuccess,
  signOut,
} from '../redux/user/userSlice';

const Password = () => {
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();

  const { currentUser, loading, error } = useSelector((state) => state.user);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

 

  const getUser = async (e) => {
    e.preventDefault();
    if (loading) return; 

    try {
      dispatch(getUserStart());
      const res = await apiClient.get('/user', {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      });
      const data = await res.json();
      if (!data.success) {
        dispatch(
          getUserFailure(data.message || 'Failed to fetch user details.'),
        );
        return;
      }
      dispatch(getUserSuccess(data));
    } catch (err) {
      dispatch(getUserFailure(err.message));
    }
  };

  const updateUserName = async (e) => {
    e.preventDefault();
    if (loading) return; // Prevent duplicate requests
    try {
      dispatch(updateUserStart());
      const res = await apiClient.put('/user',formData,
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        },
      );
      const data = await res.json();
      if (!data.success) {
        dispatch(
          updateUserFailure(data.message || 'Failed to update username.'),
        );
        return;
      }
      dispatch(updateUserSuccess(data));
    } catch (err) {
      dispatch(updateUserFailure(err.message));
    }
  };

  const handleUserPasswordSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; // Prevent duplicate requests
    try {
      dispatch(updateUserStart());
      const res = await apiClient.put('/user', formData,
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        },
      );
      const data = await res.json();
      if (!data.success) {
        dispatch(
          updateUserFailure(data.message || 'Failed to update password.'),
        );
        return;
      }
      dispatch(updateUserSuccess(data));
    } catch (err) {
      dispatch(updateUserFailure(err.message));
    }
  };

  const handleSignOut = async () => {
    try {
      await apiClient.post('/logout');
      dispatch(signOut());
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = () => {
    setFormData({}); // Reset form data
    dispatch(updateUserSuccess(false)); // Clear success message
  };

  return (
    <>
      <form onSubmit={handleUserPasswordSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            New Password
          </label>
          <input
            type="password"
            id="newPassword"
            placeholder="Enter your new password"
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Confirm New Password
          </label>
          <input
            type="password"
            id="confirmNewPassword"
            placeholder="Re-enter your new password"
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-400 transition-colors duration-200 cursor-pointer"
          >
            Update Password
          </button>

          <button
            onClick={handleSignOut}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-400 transition-colors duration-200 cursor-pointer"
          >
            Signout
          </button>

          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors duration-200 cursor-pointer"
          >
            Cancel
          </button>
          <div className="flex">
            <p className="text-red-700 mt-5">
              {error && `Error: ${error.message}`}
            </p>
            <p className="text-green-700 mt-5">
              {updateProfileSuccess && 'User is updated successfully!'}
            </p>
          </div>
        </div>
      </form>
    </>
  );
};

export default Password;
