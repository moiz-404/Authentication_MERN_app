// userprofile.service.js
import ProfileModel from '../models/profile.model.js';
import UserModel from '../models/user.model.js';

// Update user profile
const updateUserProfile = async (req, res) => {
    const { userId } = req.user;  // Assuming you get the userId from a middleware (e.g., authentication)
    const { firstName, lastName, dateOfBirth, phone, address, bio, profilePicture } = req.body;

    // Validate first and last name
    if (!firstName || !lastName) {
        return res.status(400).json({ message: 'First and last names are required' });
    }

    try {
        // Find user and populate profile
        const user = await UserModel.findById(userId).populate('profile');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const profile = user.profile;
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        // Update profile fields if provided
        if (firstName) profile.firstName = firstName;
        if (lastName) profile.lastName = lastName;
        if (dateOfBirth) profile.dateOfBirth = dateOfBirth;
        if (phone) profile.phone = phone;
        if (address) profile.address = address;
        if (bio) profile.bio = bio;
        if (profilePicture) profile.profilePicture = profilePicture;

        // Save updated profile
        await profile.save();

        // Return success response with updated profile
        res.status(200).json({ message: 'Profile updated successfully', profile });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error updating profile', error: err.message });
    }
};

// Get user profile
const getUserProfile = async (req, res) => {
    const { userId } = req.user;  // Extract user ID from the authenticated user (assuming JWT authentication)
    if (!userId) {
        return res.status(400).json({ message: 'Profile ID is required.' });  // Ensure the user ID is provided
    }
    try {
        // Find the user by ID and populate the profile field
        const user = await UserModel.findById(userId).populate('profile');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });  // Return an error if the user is not found
        }

        // Return the user's profile if found
        return res.status(200).json({ profile: user.profile });
    } catch (err) {
        console.error('Error retrieving profile:', err.message);  // Log the error for debugging
        res.status(500).json({ message: 'Error retrieving profile', error: err.message });
    }
};

// Delete profile
const deleteUserProfile = async (req, res) => {
    const { userId } = req.user;  // Extract user ID from the authenticated user (assuming JWT authentication)
    try {
        // Find the user by ID and populate the profile field
        const user = await UserModel.findById(userId).populate('profile');
        if (!user) {
            return res.status(404).json({ message: `User with ID ${userId} not found` });  // Return error if the user is not found
        }

        // Delete the user by ID, which also deletes the profile if it's embedded in the user document
        const result = await UserModel.findByIdAndDelete(userId);
        return res.status(200).json({ message: `Profile with ID ${userId} deleted successfully`, result });  // Confirm deletion
    } catch (err) {
        console.error('Error deleting profile:', err.message);  // Log the error for debugging
        res.status(500).json({ message: 'Error deleting profile', error: err.message });
    }
};

const profilesController = {
    updateUserProfile,
    getUserProfile,
    deleteUserProfile,
};

export default profilesController;
