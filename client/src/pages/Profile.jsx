
import { useSelector, useDispatch } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import app from '../firebase';

import Password from '../components/Password';
import Account from '../components/Account';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('Account');
  const tabs = [
    'Account',
    'Password',
    'Security',
    'Application',
    'Notification',
  ];

  const fileRef = useRef(null);
  const [image, setImage] = useState(null);
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();

  const { currentUser, loading, error } = useSelector((state) => state.user);
console.log(currentUser)
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

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 p-4">
      {/* Sidebar */}
      <div className="w-full md:w-1/4 bg-white rounded-lg shadow-md p-4 mb-4 md:mb-0">
        <form onSubmit={handleFileUpload} className="space-y-4">
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
        {loading ? (
          <p>Loading user data...</p>
        ) : error ? (
          <p className="text-red-700">{error}</p>
        ) : (
          <>
            {activeTab === 'Account' && (
              <Account />
            )}
            {activeTab === 'Password' && (
              <Password />
            )}
            {/* Other tabs like Security, Application, Notification can be added here */}
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
