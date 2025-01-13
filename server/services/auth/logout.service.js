// services/auth/logout.service.js
import UserModels from '../../models/user.model.js';
import logger from '../../config/logger.js';

const handleLogout = async (req, res) => {
    try {
        const refreshToken = req.cookies?.jwt_Token;
        if (!refreshToken) {
            return res.status(200).json({ message: 'No token found. Already logged out.' });
        }

        const foundUser = await UserModels.findOne({ refreshToken });
        if (!foundUser) {
            return res.status(200).json({ message: 'No user found. Already logged out.' });
        }

        foundUser.refreshToken = ''; // Clear refresh token
        await foundUser.save();

        res.clearCookie('jwt_Token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'Lax',
            maxAge: 0,
        });

        logger.info(`User with username: ${foundUser.username} logged out successfully`);
        res.status(200).json({ message: 'Logged out successfully!' });
    } catch (error) {
        logger.error(`Error during logout: ${error.message}`);
        res.status(500).json({ error: 'An error occurred during logout' });
    }
};
export default handleLogout;
