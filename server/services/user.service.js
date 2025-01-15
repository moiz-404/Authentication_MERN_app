// services/user.service.js
import UserModel from '../models/user.model.js';
import logger from '../config/logger.js';
import bcrypt from 'bcryptjs';

// Update username
const updateUserName = async (req, res) => {
    const userId = req.id; // Extracting userId from middleware
    try {
        const user = await UserModel.findById(userId).exec();
        if (!user) {
            return res.status(404).json({ message: `No user found with ID ${userId}.` });
        }

        if (!req.body?.username) {
            return res.status(400).json({ message: 'Username is required.' });
        }

        user.username = req.body.username;
        const updatedUser = await user.save();

        logger.info(`Username updated for user ID ${userId}`);
        return res.status(200).json({
            message: 'Username updated successfully.',
            user: updatedUser.username,
        });
    } catch (error) {
        logger.error(`Error updating username for user ID ${userId}: ${error.message}`);
        return res.status(500).json({ message: 'Internal server error.', error: error.message });
    }
};

// Update password with new password and confirm password
const updateUserPassword = async (req, res) => {
    const userId = req.id; // Extracting userId from middleware

    // Destructure passwords from the request body
    const { newPassword, confirmPassword } = req.body;

    try {
        // Ensure both newPassword and confirmPassword are provided
        if (!newPassword || !confirmPassword) {
            return res.status(400).json({ message: 'Both new password and confirm password are required.' });
        }

        // Check if the new password and confirm password match
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match.' });
        }

        // Optional: Add password strength validation here (e.g., min length, special chars)

        // Find the user by ID
        const user = await UserModel.findById(userId).exec();
        if (!user) {
            return res.status(404).json({ message: `No user found with ID ${userId}.` });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;

        // Save the updated user
        const updatedUser = await user.save();

        logger.info(`Password updated for user ID ${userId}`);
        return res.status(200).json({
            success: true,
            message: 'Password has been reset successfully!',
            user: updatedUser,
        });
    } catch (error) {
        logger.error(`Error updating password for user ID ${userId}: ${error.message}`);
        return res.status(500).json({ message: 'Internal server error.', error: error.message });
    }
};


// Get user details
const getUser = async (req, res) => {
    const userId = req.id;
    logger.debug(`Get user called for user ID: ${userId}`);

    try {
        const user = await UserModel.findById(userId).select('-password').exec();
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        logger.info(`User retrieved for user ID ${userId}`);
        return res.status(200).json(user);
    } catch (error) {
        logger.error(`Error retrieving user for user ID ${userId}: ${error.message}`);
        return res.status(500).json({ message: 'Internal server error.', error: error.message });
    }
};

const usersController = {
    getUser,
    updateUserName,
    updateUserPassword,
};

export default usersController;
