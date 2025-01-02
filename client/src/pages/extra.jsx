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
import { API_BASE_URL } from './apiUrl';


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
  const [updateSuccess, setUpdateSuccess] = useState(false);

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
      dispatch(updateUserStart());
      const res = await fetch(`${API_BASE_URL}/update/${currentUser._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!data.success) {
        dispatch(updateUserFailure(data.message || 'Failed to update user.'));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (err) {
      dispatch(updateUserFailure(err.message));
    }
  };

  const handleDeleteAccount = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/${API_BASE_URL}/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
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
      await fetch('${API_BASE_URL}/signout');
      dispatch(signOut());
    } catch (err) { 
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 p-4">
      {/* Sidebar */}
      <div className="w-full md:w-1/4 bg-white rounded-lg shadow-md p-4 mb-4 md:mb-0">
        <div className="text-center mb-4">
          <img
            src={formData.profilePicture || currentUser.profilePicture}
            value={formData.profilePicture || currentUser.profilePicture || ''}
            id="profilePicture"
            alt="User Profile"
            className="rounded-full mx-auto mb-2 cursor-pointer"
            onClick={() => fileRef.current.click()}
          />
          <input
            type="file"
            ref={fileRef}
            className="hidden"
            onChange={(e) => setImage(e.target.files[0])}
          />
          {imagePercent > 0 && (
            <p className="text-sm self-center">
              {imageError ? (
                <span className="text-red-700">Image upload failed.</span>
              ) : (
                <span className="text-slate-700">{`Uploading: ${imagePercent}%`}</span>
              )}
            </p>
          )}
          <h3 className="text-lg font-semibold">{currentUser.username}</h3>
        </div>
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
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-400 transition-colors duration-200 cursor-pointer'"
              >
                {loading ? 'Loading...' : 'Update'}
              </button>

              <button
                onClick={handleDeleteAccount}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-400 transition-colors duration-200 cursor-pointer'"
              >
                Delete Account
              </button>
              <button
                onClick={handleSignOut}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-400 transition-colors duration-200 cursor-pointer'"
              >
                signout
              </button>

              <button
                type="button"
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors duration-200 cursor-pointer'"
              >
                Cancel
              </button>
              <p className="text-red-700 mt-5">
                {error && `Error: ${error.message}`}
              </p>
              <p className="text-green-700 mt-5">
                {updateSuccess && 'User is updated successfully!'}
              </p>
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
                id="password"
                placeholder="Enter new password"
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirm new password"
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-400 transition-colors duration-200"
              >
                {loading ? 'Loading...' : 'Update Password'}
              </button>
              <button
                type="button"
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors duration-200 cursor-pointer'"
              >
                Cancel
              </button>
              <p className="text-red-700 mt-5">
                {error && `Error: ${error.message}`}
              </p>
              <p className="text-green-700 mt-5">
                {updateSuccess && 'Password is updated successfully!'}
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
