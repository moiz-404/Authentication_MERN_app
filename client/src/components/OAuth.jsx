// OAuth.js
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import app from '../firebase.js';  // Import Firebase configuration
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { apiClient } from '../pages/apiUrl';

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
  
      const result = await signInWithPopup(auth, provider);
      
      // Use apiClient to send a POST request
      const response = await apiClient.post('/googleAuth', {
        name: result.user.displayName,
        email: result.user.email,
        photo: result.user.photoURL,
      }, {
        withCredentials: true,  // Include cookies in requests
      });
  
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to authenticate with backend');
      }
  
      dispatch(signInSuccess(response.data));
      toast.success('Sign-in successful!'); 
      navigate('/home');
    } catch (error) {
      console.error('Google login error:', error);
      toast.error(error.message || 'Sign-in failed. Please try again.');
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleClick}
      className="w-full bg-gradient-to-r from-blue-500 to-blue-300 text-white py-2 rounded hover:from-blue-600 hover:to-blue-500 transition duration-200 flex items-center justify-center"
    >
      <img
        src="https://s3-figma-hubfile-images-production.figma.com/hub/file/carousel/img/c8fd260bd00730736bcd50bac2a6b6a5240f678d"
        alt="Google Logo"
        className="size-5 mr-2"
      />
      <span className="font-medium">Continue with Google</span>
    </button>
  );
}
