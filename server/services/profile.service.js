import UserModel from '../models/user.model.js';
import logger from '../config/logger.js';

const updateProfile = async (req, res) => {
    const userId = req.user._id; // Extracting userId from middleware
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
        res.status(200).json({ message: 'Profile updated successfully.', profile});
    } catch (error) {
        logger.error(`Error updating profile for user ID ${userId}: ${error.message}`);
        res.status(500).json({ message: 'Internal server error.', error: error.message });
    }
};

const getProfile = async (req, res) => {
    const userId = req.user._id;

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

const deleteProfile = async (req, res) => {
    const userId = req.user._id;

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


const deactivateUser = async (req, res) => {
    const userId = req.user._id;

    try {
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        
        // Soft delete: Deactivate the user by setting 'active' to false
        user.active = false;
        await user.save();
        
        logger.info(`User with ID ${userId} deactivated successfully.`);
        res.status(200).json({ message: 'User deactivated successfully.' });
    } catch (error) {
        logger.error(`Error deactivating user with ID ${userId}: ${error.message}`);
        res.status(500).json({ message: 'Internal server error.', error: error.message });
    }
};

// const deleteUserIdOnly = async (req, res) => {
//     const userId = req.user._id;

//     try {
//         const user = await UserModel.findById(userId);
//         if (!user) {
//             return res.status(404).json({ message: 'User not found.' });
//         }
        
//         // Remove the user ID but keep profile info intact
//         user._id = null; // Reset the user ID
//         await user.save();
        
//         logger.info(`User ID for user with ID ${userId} deleted successfully.`);
//         res.status(200).json({ message: 'User ID deleted, profile info retained.' });
//     } catch (error) {
//         logger.error(`Error deleting user ID for user with ID ${userId}: ${error.message}`);
//         res.status(500).json({ message: 'Internal server error.', error: error.message });
//     }
// };

// deleteProfile function to perform a soft delete:
// const deleteProfile = async (req, res) => {
//     const userId = req.user._id;

//     try {
//         const user = await UserModel.findById(userId);
//         if (!user) {
//             return res.status(404).json({ message: 'User not found.' });
//         }

//         // Soft delete: deactivate the user but retain the profile information
//         user.isActive = false;  // Assuming `isActive` is a boolean field
//         user.email = null;      // Remove email
//         user.password = null;   // Remove password

//         // Save the user with updated data
//         await user.save();
        
//         logger.info(`User profile with ID ${userId} deactivated successfully.`);
//         res.status(200).json({ message: 'User deactivated and sensitive data removed.' });
//     } catch (error) {
//         logger.error(`Error deactivating profile for user ID ${userId}: ${error.message}`);
//         res.status(500).json({ message: 'Internal server error.', error: error.message });
//     }
// };



const userProfileService = {
    updateProfile,
    getProfile,
    deleteProfile,
};

export default userProfileService;
