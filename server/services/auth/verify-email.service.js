// services/auth/verifyEmail.service.js
import UserModels from '../../models/user.model.js';

const verifyEmail = async (req, res) => {
    const { userId, otp } = req.body;

    // Validate input
    if (!userId || !otp) {
        return res.status(400).json({ message: 'User ID and OTP are required.' });
    }

    try {
        // Find the user by ID
        const user = await UserModels.findById({ userId }).exec(); 
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Validate OTP
        if (!user.verfyOtp ===''|| user.verfyOtp !== otp) {
            return res.status(400).json({ success: false, message: 'Invalid OTP.' });
        }

        // Check OTP expiration
        if (user.verfyOtpExpiresAt < Date.now()) { 
            return res.status(400).json({ success: false, message: 'OTP has expired.' });
        }

        // Mark user as verified and reset OTP fields
        user.isVerified = true;
        user.verfyOtp = '';
        user.verfyOtpExpiresAt = null; // Better to set null for non-applicable dates

        await user.save(); // Save changes to the database

        return res.status(200).json({ success: true, message: 'Email verified successfully!' });
    } catch (error) {
        console.error('Error during email verification:', error);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};
export default verifyEmail;