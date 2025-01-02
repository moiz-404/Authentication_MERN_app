import jwt from 'jsonwebtoken';

export const checkAuthStatus = (req, res, next) => {
    try {
        // Extract the token from cookies
        const { jwt_accessToken: token } = req.cookies;

        if (!token) {
            // If no token exists, the user is logged out
            return res.status(200).json({ isLoggedIn: false, message: 'User is logged out.' });
        }

        // Verify the token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        if (decodedToken && decodedToken.id) {
            // If token is valid, user is logged in
            return res.status(200).json({ isLoggedIn: true, message: 'User is logged in.', userId: decodedToken.id });
        }

        // If token is invalid, user is considered logged out
        return res.status(200).json({ isLoggedIn: false, message: 'Invalid token, user is logged out.' });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            // Handle expired token specifically
            return res.status(200).json({ isLoggedIn: false, message: 'Session expired, please log in again.' });
        }

        // Handle other errors
        return res.status(500).json({ isLoggedIn: false, message: 'Internal server error.' });
    }
};
