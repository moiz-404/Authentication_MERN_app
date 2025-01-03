import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

import Home from './pages/Home';
import PageNotFound from './pages/NotFound';
import Signup from './pages/Singnup';
import Signin from './pages/Signin';
import CreateProfile from './pages/createProfile';
import Profile from './pages/Profile';
import ResetPassword from './pages/ResetPassword';
import ResetPasswordOTP from './pages/ResetPasswordOTP';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';

function App() {
  // Get the current location
  const location = useLocation();

  // Paths where the Header should not be displayed
  const noHeaderPaths = ['/', '/signup'];

  return (
    <>
      {/* Render Header only if the current path is not in noHeaderPaths */}
      {!noHeaderPaths.includes(location.pathname) && <Header />}

      {/* Define Routes */}
      <Routes>
        <Route path="/" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/createprofile" element={<CreateProfile />} />
        <Route path="/home" element={<Home />} />
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="/resetPasswordOTP" element={<ResetPasswordOTP />} />
        <Route path="/resetPassword" element={<ResetPassword />} />

        {/* Catch-all for undefined routes */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default function RootApp() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
