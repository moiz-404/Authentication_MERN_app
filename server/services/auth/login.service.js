// controllers/authController/login.Controller.js

import UserModels from '../../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import logger from '../../config/logger.js'; // Import the logger

// Handler for login a new user
export const handleLogin = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ 'message': 'Email and password are required.' });
    }

    try {
        const foundUser = await UserModels.findOne({ email }).exec();

        if (!foundUser) {
            return res.status(401).json({ 'message': 'Unauthorized, email not found.' });
        }

        // Evaluate password
        const isMatch = await bcrypt.compare(password, foundUser.password);

        if (!isMatch) {
            return res.status(401).json({ 'message': 'Unauthorized, incorrect password.' });
        }

        // Create JWTs
        const token = jwt.sign(
            { "id": foundUser._id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        // Save Token with the current user
        foundUser.token = token;
        await foundUser.save();

        // Set secure cookie with token
        res.cookie('jwt_accessToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : '',
            expires: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours
        });

        // Log successful login
        logger.info(`User with email ${email} logged in successfully`); // Log success

        // Respond with the access token and user info in the response body
        res.status(200).json({
            message: 'Logged in successfully',
            foundUser,
        });
    } catch (error) {
        logger.error('Error during login: ' + error.message); // Log error if something goes wrong
        res.status(500).json({ 'message': 'Internal server error' });
        next(error);
    }
};
