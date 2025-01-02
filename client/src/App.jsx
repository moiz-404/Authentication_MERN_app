import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Use BrowserRouter and Routes

import Home from './pages/Home';
import PageNotFound from './pages/NotFound';
import Signup from './pages/Singnup';
import Signin from './pages/Signin';
import CreateProfile from './pages/createProfile';
import Profile from './pages/Profile';
import ResetPasswordOTP from './pages/ResetPasswordOTP';
import Reset from './pages/ResetPassword';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    // Wrap the entire app inside BrowserRouter
    <BrowserRouter>
      {/* Header component stays outside of Routes */}
      <Header />

      {/* Use Routes and Route to define your paths */}
      <Routes>
        <Route path="/" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/createprofile" element={<CreateProfile />} />
        <Route path="/home" element={<Home />} />
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/resetPasswordOTP" element={<ResetPasswordOTP />} />
          <Route path="/resetPassword" element={<Reset />} />
        </Route>

        {/* Catch-all for undefined routes */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
