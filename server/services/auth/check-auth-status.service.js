// ./service/auth/check-auth-status.service.js
import jwt from 'jsonwebtoken';

const checkAuthStatus = (req, res) => {
    try {
        const token = req.cookies?.jwt_Token;

        if (!token) {
            return res.status(200).json({ isLoggedIn: false, message: 'User is logged out.' });
        }

        const decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

        if (decodedToken) {
            return res.status(200).json({ isLoggedIn: true, message: 'User is logged in.', userId: decodedToken.userId });
        }

        return res.status(200).json({ isLoggedIn: false, message: 'Invalid token, user is logged out.' });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(200).json({ isLoggedIn: false, message: 'Session expired, please log in again.' });
        }

        return res.status(500).json({ isLoggedIn: false, message: 'Internal server error.' });
    }
};
export default checkAuthStatus;
