// services/auth/lrefresh-token.service.js
import UserModel from '../model/User.js';
import jwt from 'jsonwebtoken';

const handleRefreshToken = async (req, res) => {
    const refreshToken = req.cookies?.jwt_Token;

    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token not found' }); 
    }

    try {
        const foundUser = await UserModel.findOne({ refreshToken }).exec();
        if (!foundUser) {
            return res.status(403).json({ message: 'User not found or refresh token mismatch' }); 
        }

        jwt.verify(refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (err, decoded) => {
                if (err || foundUser._id.toString() !== decoded.userId) { // Ensure correct userId
                    return res.status(403).json({ message: 'Invalid refresh token' }); 
                }

                const token = jwt.sign(
                    { userId: foundUser._id },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '1d' } // Access token expiration
                );

                res.json({ message: 'Token refreshed successfully', token });
            }
        );

    } catch (error) {
        console.error('Error in handleRefreshToken:', error);

        if (error.name === 'TokenExpiredError') {
            return res.status(403).json({ message: 'Refresh token expired' }); 
        }

        res.status(500).json({ message: 'Internal server error, please try again later' }); 
    }
};
export default handleRefreshToken;
