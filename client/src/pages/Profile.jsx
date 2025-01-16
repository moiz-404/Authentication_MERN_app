import { apiClient } from './apiUrl';
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
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOut,
} from '../redux/user/userSlice';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('Account');
  const tabs = [
    'Account',
    'Password',
    'Security',
    'Application',
    'Notification',
  ];

  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const [image, setImage] = useState(null);
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({});

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
    try {
      if (loading) return; // Prevent duplicate requests
      dispatch(updateUserStart());
      const res = await apiClient.put(`/profile/${currentUser._id}`, formData);
      const data = await res.json();

      if (!data.success) {
        dispatch(updateUserFailure(data.message || 'Failed to update user.'));
        return;
      }
      dispatch(updateUserSuccess(data));
    } catch (err) {
      dispatch(updateUserFailure(err.message));
    }
  };

  const handleDeleteAccount = async () => {
    try {
      if (loading) return; // Prevent duplicate requests
      dispatch(deleteUserStart());
      const res = await apiClient.delete(`/profile/${currentUser._id}`, formData);
      const data = await res.json();

      if (!data.success) {
        dispatch(
          deleteUserFailure(data.message || 'Failed to delete account.'),
        );
        return;
      }

      dispatch(deleteUserSuccess());
    } catch (err) {
      dispatch(deleteUserFailure(err.message));
    }
  };

  const handleSignOut = async () => {
    try {
      const res = await apiClient.post(`/logout`);
      dispatch(signOut());
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = () => {
    setFormData({}); // Reset form data
    setUpdateSuccess(false); // Clear success message
    setImage(null); // Clear uploaded image
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 p-4">
      {/* Sidebar */}
      <div className="w-full md:w-1/4 bg-white rounded-lg shadow-md p-4 mb-4 md:mb-0">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-center mb-4">
            <input
              type="file"
              ref={fileRef}
              className="hidden"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
            <img
              src={formData.profilePicture || currentUser.profilePicture}
              id="profilePicture"
              alt="User Profile"
              className="rounded-full mx-auto mb-2 cursor-pointer"
              onClick={() => fileRef.current.click()}
            />
            <p className="text-sm self-center">
              {imageError ? (
                <span className="text-red-700">
                  Error uploading image (file size must be less than 2 MB)
                </span>
              ) : imagePercent > 0 && imagePercent < 100 ? (
                <span className="text-slate-700">{`Uploading: ${imagePercent} %`}</span>
              ) : imagePercent === 100 ? (
                <span className="text-green-700">
                  Image uploaded successfully
                </span>
              ) : (
                ''
              )}
            </p>
            <h3 className="text-lg font-semibold">{currentUser.username}</h3>
          </div>
        </form>
        <ul className="space-y-2">
          {tabs.map((tab) => (
            <li
              key={tab}
              className={`cursor-pointer p-2 rounded-md hover:bg-blue-100 transition-colors duration-200 ${
                activeTab === tab
                  ? 'bg-blue-200 text-blue-800'
                  : 'text-gray-600'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="w-full md:w-3/4 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold">{activeTab} Settings</h2>
        {loadingUser ? (
          <p>Loading user data...</p>
        ) : userError ? (
          <p className="text-red-700">{userError}</p>
        ) : (
          <>
            {activeTab === 'Account' && (
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
                  <label className="block text-sm font-medium text-gray-700">
                    Bio
                  </label>
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
                      {updateSuccess && 'User is updated successfully!'}
                    </p>
                  </div>
                </div>
              </form>
            )}
            {activeTab === 'Password' && (
              <form onSubmit={handleSubmit} className="space-y-4">
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
                      {updateSuccess && 'User is updated successfully!'}
                    </p>
                  </div>
                </div>
              </form>
            )}
            {/* Other tabs like Security, Application, Notification can be added here */}
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
