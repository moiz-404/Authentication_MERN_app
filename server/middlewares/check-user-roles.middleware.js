// Middleware for checking if the user is the profile owner or admin
const checkProfileOwnershipOrAdmin = (req, res, next) => {
    const { userId } = req.params; // Assuming profile has a 'userId'
    const { role } = req.user; // Extract the user's role
  
    if (role === 'admin' || req.user.id === userId) {
      return next();
    }
  
    return res.status(403).json({ message: 'You do not have permission to delete this profile.' });
  };