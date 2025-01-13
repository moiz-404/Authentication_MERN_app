// services/auth/verify-jwt.service.js
import jwt from 'jsonwebtoken';

const verifyJWT = async (req, res, next) => {
    try {
        const authHeader =
            req.headers.authorization ||
            req.headers.Authorization ||
            `Bearer ${req.cookies?.jwt_Token}`;
        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized, token missing. Please login again.' });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized, token missing. Please login again.' });
        }

        // Verify the token
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (!decodedToken) {
            return res.status(403).json({ message: 'Invalid token. Access denied.' });
        }

        req.id = decodedToken.userId; 
        next();
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
