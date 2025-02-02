// ./servives/auth/login.servive.js
import UserModels from '../../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import logger from '../../config/logger.js';

const handleLogin = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required.' });

    try {
        const foundUser = await UserModels.findOne({ email });
        if (!foundUser) return res.status(401).json({ message: 'Login failed: Email not registered.' });

        const isMatch = await bcrypt.compare(password, foundUser.password);
        if (!isMatch) return res.status(401).json({ message: 'Login failed: Incorrect password..' });

        const token = jwt.sign(
            { userId: foundUser._id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' }
        );

        const refreshToken = jwt.sign(
            { userId: foundUser._id },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '7d' }
        );

        // Ensure no duplicate refresh tokens are saved
        if (foundUser.refreshToken) {
            foundUser.refreshToken = ''; // Invalidate old refresh token
        }
        foundUser.refreshToken = refreshToken;
        await foundUser.save();

        res.cookie('jwt_Token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'Lax',
            expires: new Date(Date.now() + 2 * 60 * 60 * 1000),
        });

        logger.info(`User with email ${email} logged in successfully`);

        res.status(200).json({
            message: 'Logged in successfully',
            token,refreshToken,user:foundUser
        });
    } catch (error) {
        logger.error('Error during login: ' + error.message);
        res.status(500).json({ message: 'Internal server error' });
        next(error);
    }
};
export default handleLogin;