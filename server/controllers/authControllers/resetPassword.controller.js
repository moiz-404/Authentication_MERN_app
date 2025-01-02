// controllers/authController/resetPassword.Controller.js
import UserModels from '../../models/User.Model.js';
import bcrypt from 'bcryptjs';

 
export const resetPassword = async (req, res) => {
    const { email, otp, password } = req.body;

    // Validate input
    if (!email || !otp || !password) {
        return res.status(400).json({ message: 'Email, Password and OTP are required.' });
    }

    try {
        // Find the user by ID
        const user = await UserModels.findById({ email }).exec();
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Validate OTP
        if (!user.PasswordResetOtp === '' || user.PasswordResetOtp !== otp) {
            return res.status(400).json({ success: false, message: 'Invalid OTP.' });
        }

        // Check OTP expiration
        if (user.PasswordResetOtpExpiresAt < Date.now()) {
            return res.status(400).json({ success: false, message: 'OTP has expired.' });
        }

        // Encrypt the password
        const hashedPassword = await bcrypt.hashSync(password, 10);
        
        // Mark user as verified and reset OTP fields
        user.password = hashedPassword;
        user.PasswordResetOtp = '';
        user.PasswordResetOtpExpiresAt = null; 

        await user.save(); 
        return res.status(200).json({ success: true, message: 'password has been reset successfully!' });
    } catch (error) {
        console.error('Error during email verification:', error);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};
