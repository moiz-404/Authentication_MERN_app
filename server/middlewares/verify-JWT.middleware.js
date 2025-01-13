// ./middleware/verify-JWT.middleware.js
import jwt from 'jsonwebtoken';
export const verifyJWT = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || req.headers.Authorization || req.cookies.jwt_accessToken;
        if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized, token missing. Please login again.' });
        }

        // Verify the token
        const decodedToken = await jwt.verify(token, process.env.JWT_SECRET,)
        if (!decodedToken) return res.Status(403).json({ message: "invalid token" }); 
        req.id = decodedToken.userId;
        // Fetch user from the database if needed
        // const user = await User.findById(req.user.id);
        // req.user.role = user.role; // Assuming 'role' is stored in the User model
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Unauthorized, token expired. Please login again.' });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Unauthorized, invalid token. Please login again.' });
        }
        console.error('Error in verifyUserAuth middleware:', error);
        return res.status(500).json({ message: 'Internal server error. Please try again later.' });
    }
};
