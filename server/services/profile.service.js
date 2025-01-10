// user.controller.js
import profileModel from '../models/profile.Model.js';
import mongoose from 'mongoose';

// Get all profiles
const getAllProfiles = async (req, res) => {
    try {
        const profiles = await profileModel.find();
        if (!profiles || profiles.length === 0) {
            return res.status(404).json({ message: 'No profiles found' });
        }
        res.status(200).json(profiles);
    } catch (err) {
        console.error('Error retrieving profiles:', err.message);
        res.status(500).json({ message: 'Error retrieving profiles', error: err.message });
    }
};

// create profiles
const createProfile = async (req, res) => {
    const { firstName, lastName, dateOfBirth, phone, address, bio, avatar, profilePicture } = req.body;

    // Check for required fields (firstName and lastName)
    if (!firstName || !lastName) {
        return res.status(400).json({ message: 'First and last names are required' });
    }

    try {
        const result = await profileModel.create({
            firstName,
            lastName,
            dateOfBirth,
            phone,
            address,
            bio,
            avatar,
            profilePicture
        });

        res.status(201).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occurred while creating the profile' });
    }
};

// Update profile by ID
const updateProfile = async (req, res, next) => {
    try {
        const profileId = req?.params?.id;
        if (!profileId) {
            return res.status(400).json({ 'message': 'ID parameter is required.' });
        }

        // Ensure the profile is trying to update their own account
        if (req.profile.id !== profileId) {
            return next(errorHandler(401, 'You can update only your account!'));
        }

        // Debug: Log the profileId being queried
        console.log('Querying for profile with ID:', profileId);

        // Find profile by ID
        const profile = await profileModel.findById({ _id: profileId }).exec();
        if (!profile) {
            console.log(`No profile found with ID: ${profileId}`);
            return res.status(404).json({ message: `No profile found with ID ${profileId}.` });
        }

        // Update fields only if provided in the request body
        if (req.body?.firstName) profile.firstName = req.body.firstName;
        if (req.body?.lastName) profile.lastName = req.body.lastName;
        if (req.body?.dateOfBirth) profile.dateOfBirth = req.body.dateOfBirth;
        if (req.body?.phone) profile.phone = req.body.phone;
        if (req.body?.address) profile.address = req.body.address;
        if (req.body?.bio) profile.bio = req.body.bio;
        if (req.body?.avatar) profile.avatar = req.body.avatar;
        if (req.body?.profilePicture) profile.profilePicture = req.body.profilePicture;

        // Save the updated profile to the database
        const updatedprofile = await profile.save();
        return res.status(200).json(updatedprofile);
    } catch (error) {
        console.error('Error updating profile:', error.message);
        return res.status(500).json({ message: 'An error occurred while updating the profile.' });
    }
};

// Delete profile by ID
const deleteProfile = async (req, res) => {
    try {
        // Extract profile ID from the URL parameters
        const { id } = req.params;

        // Check if the ID was provided in the request parameters
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Valid profile ID is required.' });
        }

        // Search for the profile in the database using the provided ID
        const profile = await profileModel.findById(id).exec();
        if (!profile) {
            return res.status(404).json({ message: `profile with ID ${id} not found` });
        }

        // Delete the profile from the database using their _id
        const result = await profileModel.deleteOne({ _id: profile._id });
        res.status(200).json({ message: `profile with ID ${id} deleted successfully`, result });
    } catch (err) {
        console.error('Error deleting profile:', err.message);
        res.status(500).json({ message: 'Error deleting profile', error: err.message });
    }
};



// Get profile by ID
const getProfile = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('profile ID:', id);
        if (!id) {
            return res.status(400).json({ message: 'profile ID is required.' });
        }


        const profile = await profileModel.findById(id).exec();
        if (!profile) {
            return res.status(404).json({ message: `profile with ID ${id} not found` });
        }

        res.status(200).json(profile);
    } catch (err) {
        console.error('Error retrieving profile:', err.message);
        res.status(500).json({ message: 'Error retrieving profile', error: err.message });
    }
};

const profilesController = {
    createProfile,
    getAllProfiles,
    updateProfile,
    getProfile,
    deleteProfile,
};

export default profilesController;