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
  getProfileStart,
  getProfileSuccess,
  getProfileFailure,
  updateProfileStart,
  updateProfileSuccess,
  updateProfileFailure,
  deleteProfileStart,
  deleteProfileSuccess,
  deleteProfileFailure,
  signOut,
} from '../redux/user/userSlice';

const Account = () => {
  const fileRef = useRef(null);
  const [image, setImage] = useState(null);
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();

  const { currentUser, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    if (image) handleFileUpload(image);
  }, [image]);

  const handleFileUpload = (image) => {
    const storage = getStorage(app);
    const fileName = `${Date.now()}_${image.name}`;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePercent(Math.round(progress));
      },
      () => setImageError(true),
      () =>
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData((prev) => ({ ...prev, profilePicture: downloadURL }));
          setImagePercent(0); // Reset after upload
        }),
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; // Prevent duplicate requests

    try {
      dispatch(updateProfileStart());
      const res = await apiClient.put(`/profile`, formData, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      });
      const data = await res.json();
      if (!data.success) {
        dispatch(
          updateProfileFailure(data.message || 'Failed to update user.'),
        );
        return;
      }
      dispatch(updateProfileSuccess(data));
    } catch (err) {
      dispatch(updateProfileFailure(err.message));
    }
  };

  const handleDeleteAccount = async () => {
    if (loading) return;
    try {
      dispatch(deleteProfileStart());
      const res = await apiClient.delete(`/profile`, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      });
      const data = await res.json();

      if (!data.success) {
        dispatch(
          deleteProfileFailure(data.message || 'Failed to delete account.'),
        );
        return;
      }

      dispatch(deleteProfileSuccess());
    } catch (err) {
      dispatch(deleteProfileFailure(err.message));
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
    dispatch(updateProfileSuccess(false)); // Clear success message
    setImage(null); // Clear uploaded image
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            value={formData.username || currentUser.username || ''}
            type="text"
            id="username"
            placeholder="Username"
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              value={formData.firstName || currentUser.firstName || ''}
              type="text"
              id="firstName"
              placeholder="First Name"
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              value={formData.lastName || currentUser.lastName || ''}
              type="text"
              id="lastName"
              placeholder="Last Name"
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              value={formData.email || currentUser.email || ''}
              type="email"
              id="email"
              placeholder="Email"
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone No#
            </label>
            <input
              value={formData.mobile || currentUser.mobile || ''}
              type="number"
              id="mobile"
              placeholder="Phone No#"
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Address
          </label>
          <input
            value={formData.address || currentUser.address || ''}
            type="address"
            id="address"
            placeholder="Address"
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Bio</label>
          <textarea
            value={formData.bio || currentUser.bio || ''}
            id="bio"
            placeholder="Write something about yourself..."
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          ></textarea>
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-400 transition-colors duration-200 cursor-pointer"
          >
            {loading ? 'Loading...' : 'Update'}
          </button>

          <button
            onClick={handleDeleteAccount}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-400 transition-colors duration-200 cursor-pointer"
          >
            Delete Account
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

export default Account;
