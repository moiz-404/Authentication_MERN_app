// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  // apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  apiKey: "AIzaSyA8j3lxuf2ArtbmjRZEWQK_adROPtO1W9A",
  authDomain: "mern-auth-ceecb.firebaseapp.com",
  projectId: "mern-auth-ceecb",
  storageBucket: "mern-auth-ceecb.firebasestorage.app",
  messagingSenderId: "503886163812",
  appId: "1:503886163812:web:f4e1a813836265b74c1471"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;