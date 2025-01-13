import UserModel from '../models/user.model.js';
import logger from '../config/logger.js';

const updateUserProfile = async (req, res) => {
    const userId = req.id; // Extracting userId from middleware
    const { firstName, lastName, dateOfBirth, phone, address, bio, profilePicture } = req.body;

    if (!firstName || !lastName) {
        return res.status(400).json({ message: 'First and last names are required.' });
    }

    try {
        const user = await UserModel.findById(userId).populate('profile');
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const profile = user.profile;
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found.' });
        }

        // Update profile fields
        if (firstName) profile.firstName = firstName;
        if (lastName) profile.lastName = lastName;
        if (dateOfBirth) profile.dateOfBirth = dateOfBirth;
        if (phone) profile.phone = phone;
        if (address) profile.address = address;
        if (bio) profile.bio = bio;
        if (profilePicture) profile.profilePicture = profilePicture;

        // Save updated profile
        await profile.save();
        logger.info(`Profile updated for user ID ${userId}`);
        res.status(200).json({ message: 'Profile updated successfully.', profile });
    } catch (error) {
        logger.error(`Error updating profile for user ID ${userId}: ${error.message}`);
        res.status(500).json({ message: 'Internal server error.', error: error.message });
    }
};

const getUserProfile = async (req, res) => {
    const userId = req.id;

    try {
        const user = await UserModel.findById(userId).populate('profile');
        if (!user || !user.profile) {
            return res.status(404).json({ message: 'User profile not found.' });
        }

        logger.info(`User profile retrieved for user ID ${userId}`);
        res.status(200).json({ profile: user.profile });
    } catch (error) {
        logger.error(`Error retrieving profile for user ID ${userId}: ${error.message}`);
        res.status(500).json({ message: 'Internal server error.', error: error.message });
    }
};

const deleteUserProfile = async (req, res) => {
    const userId = req.id;

    try {
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        // Delete the user by ID, which also deletes the profile if it's embedded in the user document
        await UserModel.findByIdAndDelete(userId);
        logger.info(`Profile with ID ${userId} deleted successfully.`);
        res.status(200).json({ message: 'User and profile deleted successfully.' });
    } catch (error) {
        logger.error(`Error deleting profile for user ID ${userId}: ${error.message}`);
        res.status(500).json({ message: 'Internal server error.', error: error.message });
    }
};

const userProfileService = {
    updateUserProfile,
    getUserProfile,
    deleteUserProfile,
};

export default userProfileService;
