// controllers/authController/sendPasswordResetOtp.Controller.js
import UserModels from '../../models/User.Model.js';
import transporter from '../../config/nodemmailer.js';

export const sendPasswordResetOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ 'message': 'Email is required.' });
        }

        const user = await UserModels.findById({ email }).exec();
        if (!user) {
            return res.status(401).json({ 'message': 'Unauthorized, User not found.' });
        }
        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.PasswordResetOtp = otp;
        user.PasswordResetOtpExpiresAt = new Date(Date.now() + 15 * 60 * 1000);

        await user.save();

        // sending OTP email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Password Reset OTP ',
            text: `Your OTP for resetting your password is ${otp}. Use this OTP to proceed with resetting your password.`,
        }

        await transporter.sendMail(mailOptions);

        res.json({ success: ture, message: 'OTP sent on Email' });

    } catch (error) {
        res.json({ success: false, message: error.message });

    }

}
