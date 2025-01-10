// controllers/auth/logout.Controller.js
import UserModels from '../../models/user.model.js';

// Handler for logging out a user
export const handleLogout = async (req, res) => {
    try {
        const { cookies } = req;
        const token = cookies?.jwt_accessToken;

        // If no token is found, respond with a message
        if (!token) {
            return res.status(200).json({ message: 'No token found. Already logged out.' });
        }

        // Check if the user associated with the token exists in the database
        const foundUser = await UserModels.findOne({ token }).exec();

        // If no user is found, respond with a message
        if (!foundUser) {
            return res.status(200).json({ message: 'No user found. Already logged out.' });
        }

        // Clear the token in the database
        foundUser.token = '';
        await foundUser.save();

        // Clear access token from the client
        res.clearCookie('jwt_accessToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : '',
        });

        // Respond with a success message
        return res.status(200).json({ message: 'Logged out successfully!' });
    } catch (error) {
        console.error('Logout error:', error);
        return res.status(500).json({ error: 'An error occurred during logout' });
    }
};
