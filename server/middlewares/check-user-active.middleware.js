const checkUserActive = async (req, res, next) => {
    const userId = req.user._id;

    try {
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        if (!user.active) {
            return res.status(403).json({ message: 'Your account is deactivated. Please contact support or reactivate your account.' });
        }

        // Proceed to the next middleware or route handler if the user is active
        next();
    } catch (error) {
        logger.error(`Error checking active status for user ID ${userId}: ${error.message}`);
        res.status(500).json({ message: 'Internal server error.', error: error.message });
    }
};
