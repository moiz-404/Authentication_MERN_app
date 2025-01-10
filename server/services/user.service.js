// user.service.js
import UserModel from '../models/user.model.js';

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find();
        if (!users || users.length === 0) {
            return res.status(404).json({ message: 'No users found' });
        }
        res.status(200).json(users);
    } catch (err) {
        console.error('Error retrieving users:', err.message);
        res.status(500).json({ message: 'Error retrieving users', error: err.message });
    }
};

// Update user by ID
const updateUser = async (req, res, next) => {
    try {
        const userId = req?.params?.id;
        if (!userId) {
            return res.status(400).json({ 'message': 'ID parameter is required.' });
        }

        // Ensure the user is trying to update their own account
        if (req.user.id !== userId) {
            return next(errorHandler(401, 'You can update only your account!'));
        }

        // Debug: Log the userId being queried
        console.log('Querying for user with ID:', userId);

        // Find user by ID
        const user = await UserModel.findById({ _id: userId }).exec();
        if (!user) {
            console.log(`No user found with ID: ${userId}`);
            return res.status(404).json({ message: `No user found with ID ${userId}.` });
        }

        // Update fields only if provided in the request body
        if (req.body?.username) user.username = req.body.username;
        if (req.body?.email) user.email = req.body.email;
        if (req.body?.password) {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            user.password = hashedPassword;
        }
        if (req.body?.isActive !== undefined) user.isActive = req.body.isActive;
        if (req.body?.isVerified !== undefined) user.isVerified = req.body.isVerified;

        // Save the updated user to the database
        const updatedUser = await user.save();
        return res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error.message);
        return res.status(500).json({ message: 'An error occurred while updating the user.' });
    }
};

// Delete user by ID
const deleteUser = async (req, res) => {
    try {
        // Extract user ID from the URL parameters
        const { id } = req.params;

        // Check if the ID was provided in the request parameters
        if (!id) {
            return res.status(400).json({ message: 'User ID is required.' });  // Return a 400 status if ID is missing
        }

        // Search for the user in the database using the provided ID
        const user = await UserModel.findById(id).exec();
        if (!user) {
            return res.status(404).json({ message: `User with ID ${id} not found` });
        }

        // Delete the user from the database using their _id
        const result = await UserModel.deleteOne({ _id: user._id });
        res.status(200).json({ message: `User with ID ${id} deleted successfully`, result });
    } catch (err) {
        console.error('Error deleting user:', err.message);
        res.status(500).json({ message: 'Error deleting user', error: err.message });
    }
};

// Get user by ID
const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('User ID:', id);
        if (!id) {
            return res.status(400).json({ message: 'User ID is required.' });
        }
        const user = await UserModel.findById(id).exec();
        if (!user) {
            return res.status(404).json({ message: `User with ID ${id} not found` });
        }
        res.status(200).json(user);
    } catch (err) {
        console.error('Error retrieving user:', err.message);
        res.status(500).json({ message: 'Error retrieving user', error: err.message });
    }
};

const usersController = {
    getAllUsers,
    updateUser,
    deleteUser,
    getUser,
};

export default usersController;