import User from '../model/User.js';
import jwt from 'jsonwebtoken';

export const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;

    // Check if the refresh token is present in cookies
    if (!cookies?.jwt) {
        return res.status(401).json({ message: 'Refresh token not found' }); // Unauthorized
    }

    const refreshToken = cookies.jwt;

    try {
        // Find the user by the refresh token
        const foundUser = await User.findOne({ refreshToken }).exec();
        if (!foundUser) {
            return res.status(403).json({ message: 'User not found or refresh token mismatch' }); // Forbidden
        }

        // Verify the JWT
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        
        if (!decoded || foundUser.username !== decoded.username) {
            return res.status(403).json({ message: 'Invalid refresh token' }); // Forbidden, invalid token
        }

        // Generate a new access token
        const accessToken = jwt.sign(
            { userId: foundUser._id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1d' } // 1-day expiration
        );

        // Return the new access token
        res.json({ message: 'Token refreshed successfully', accessToken });

    } catch (error) {
        console.error('Error in handleRefreshToken:', error);

        // Handle token expiration error separately
        if (error.name === 'TokenExpiredError') {
            return res.status(403).json({ message: 'Refresh token expired' }); // Forbidden, token expired
        }

        // Handle other JWT errors or unexpected errors
        res.status(500).json({ message: 'Internal server error, please try again later' }); // Internal Server Error
    }
};
