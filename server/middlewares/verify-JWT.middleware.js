// services/auth/verify-jwt.service.js
import jwt from 'jsonwebtoken';
import UserModels from '../models/user.model.js';

const verifyJWT = async (req, res, next) => {
    try {
        const authHeader =
            req.headers.authorization ||
            req.headers.Authorization ||
            req.cookies.jwt_Token ||
            `Bearer ${req.cookies?.jwt_Token}`;
        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized, token missing. Please login again.' });
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized, token missing. Please login again.' });
        }
        // Verify the token callback function
        jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET,
            async (err, decoded) => { // Mark the callback function as async
                if (err) return res.status(403).json({ message: 'Invalid token. Access denied.' });
                const user = await UserModels.findById(decoded.userId);
                // const user = await userModel.findById(decoded._Id); 
                if (!user) return res.status(404).json({ message: 'User not found. Access denied.' });
                req.user = user;
                next();
            }
        );
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Unauthorized, token expired. Please login again.' });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Unauthorized, invalid token. Please login again.' });
        }
        console.error('Error in verifyJWT middleware:', error.message);
        return res.status(500).json({ message: 'Internal server error. Please try again later.' });
    }
};

export default verifyJWT;
