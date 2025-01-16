import { useSelector, useDispatch } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  createProfileStart,
  createProfileSuccess,
  createProfileFailure,
  signOut,
} from '../redux/user/userSlice';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import app from '../firebase';
import { toast } from 'react-toastify';
import { apiClient } from './apiUrl';

const CreateProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const [image, setImage] = useState(null);
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);

  const { currentUser, loading, createProfileSuccess } = useSelector(
    (state) => state.user,
  );

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
      (error) => {
        if (error.code === 'storage/unauthorized') {
          setImageError('Unauthorized access.');
        } else if (error.code === 'storage/unknown') {
          setImageError('Unknown error occurred.');
        } else {
          setImageError('Error uploading image.');
        }
      },
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

    if (!formData.firstName || !formData.lastName) {
      setError({ message: 'Please fill out all required fields.' });
      toast.error('Please fill out all required fields.');
      return;
    }

    try {
      dispatch(createProfileStart());
      const { data, status } = await apiClient.put('/profile', formData);

      if (!status === 201 && !data.success) {
        dispatch(
          createProfileFailure(data.message || 'Profile creation failed.'),
        );
        toast.error(data.message || 'Profile creation failed.');
      }
      dispatch(createProfileSuccess(data.profile));
      toast.success('Profile creation successfully!');
      navigate('/home');
    } catch (err) {
      dispatch(
        createProfileFailure('An error occurred during profile creation.'),
      );
      toast.error('An error occurred during profile creation.');
    }
  };

  const handleSkip = () => {
    if (!formData.firstName || !formData.lastName) {
      setError({ message: 'Please firstName && lastName is required fields.' });
      toast.error('Please firstName && lastName is required fields.');
      return;
    }
    try {
      dispatch(createProfileStart());
      toast.info('Profile creation skipped.');
      navigate('/home');
    } catch (err) {
      dispatch(
        createProfileFailure('An error occurred during profile creation.'),
      );
      toast.error('An error occurred during profile creation.');
    }
  };

  const handleCancel = () => {
    setFormData({});
    setImage(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      {/* Main Content */}
      <div className="w-full md:w-2/3 lg:w-1/2 bg-white rounded-lg shadow-md p-6 space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-4xl font-semibold mb-4">Profile</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center mb-4">
            <input
              type="file"
              ref={fileRef}
              className="hidden"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
            <img
              src="https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg"
              id="profilePicture"
              alt="User Profile"
              className="rounded-full mx-auto mb-4 size-48 object-cover cursor-pointer"
              onClick={() => fileRef.current.click()}
            />
            <p className="text-sm self-center">
              {imageError ? (
                <span className="text-red-700">{imageError}</span>
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
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                id="username"
                placeholder="Username"
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  placeholder="First Name"
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  placeholder="Last Name"
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                type="address"
                id="address"
                placeholder="Address"
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                placeholder="Write something about yourself..."
              ></textarea>
            </div>

            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mt-6">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-400 transition-colors duration-200 cursor-pointer w-full md:w-auto"
              >
                {loading ? 'Loading...' : 'Save'}
              </button>

              <button
                onClick={handleSkip}
                className="bg-zinc-500 text-white px-4 py-2 rounded-md hover:bg-stone-400 transition-colors duration-200 cursor-pointer w-full md:w-auto"
              >
                Skip
              </button>

              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors duration-200 cursor-pointer w-full md:w-auto"
              >
                Cancel
              </button>
            </div>

            <div className="flex mt-5 space-x-4">
              <p className="text-red-700">
                {error && `Error: ${error.message}`}
              </p>
              <p className="text-green-700">
                {createProfileSuccess && 'User profile created successfully!'}
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProfile;
