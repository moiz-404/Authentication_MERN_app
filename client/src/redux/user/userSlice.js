import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentUser: null,
  loading: false,
  error: null,  // Changed from false to null
  token: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
    },
    signInSuccess: (state, action) => {
      const { token, user } = action.payload;
      state.currentUser = user;
      state.token = token;
      state.loading = false;
      state.error = null;  // Ensure error resets to null
      
      // Store token in localStorage
      localStorage.setItem('token', token);
    },
    signInFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateUserStart: (state) => {
      state.loading = true;
    },
    updateUserSuccess: (state, action) => {
      const { user } = action.payload;
      state.currentUser = user;
      state.loading = false;
      state.error = null;
    },
    updateUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    getUserStart: (state) => {
      state.loading = true;
    },
    getUserSuccess: (state, action) => {
      const { user } = action.payload;
      state.currentUser = user;
      state.loading = false;
      state.error = null;
    },
    getUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    getProfileStart: (state) => {
      state.loading = true;
    },
    getProfileSuccess: (state, action) => {
      const { user } = action.payload;
      console.log(user, "profile");
      state.currentUser = user;
      state.loading = false;
      state.error = null;
    },
    getProfileFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateProfileStart: (state) => {
      state.loading = true;
    },
    updateProfileSuccess: (state, action) => {
      const { user } = action.payload;
      state.currentUser = user;
      state.loading = false;
      state.error = null;
    },
    updateProfileFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteProfileStart: (state) => {
      state.loading = true;
    },
    deleteProfileSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    deleteProfileFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    signOut: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null; 
      state.token = ''; // Clear token on sign out
      
      // Remove token from localStorage
      localStorage.removeItem('token');
    },
  },
});

export const {
  signInStart,
  signInSuccess,
  signInFailure,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
  getUserStart,
  getUserSuccess,
  getUserFailure,
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
} = userSlice.actions;

export default userSlice.reducer;
