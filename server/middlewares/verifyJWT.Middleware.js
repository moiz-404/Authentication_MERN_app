// ./middleware/userAuth.Middleware.js
import jwt from 'jsonwebtoken';
export const verifyJWT = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || req.headers.Authorization;
        if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized, token missing. Please login again.' });
        }

        // Verify the token
        jwt.verify(
            token,
            process.env.JWT_SECRET,
            (err, decodedToken) => {
                if (err) return res.sendStatus(403); //invalid token
                req.user = { id: decodedToken.id };
                next();
            })
 
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
