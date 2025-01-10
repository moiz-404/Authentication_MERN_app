// controllers/authController/sendVerifyOtp.Controller.js
import UserModels from '../../models/user.model.js';
import transporter from '../../config/node-mailer.js';

export const sendVerifyOtp = async (req, res) => {
    try {
        const { userId } = req.body;

        const user = await UserModels.findById({ userId }).exec();
        if (user.isVerified) {
            return res.json({ success: false, message: 'Account Already verified' });
        }
        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.verfyOtp = otp;
        user.verfyOtpExpiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000);

        await user.save();

        // sending OTP email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Account Verification OTP ',
            text: `your OTP is ${otp}. Verify your account using this OTP.`,
        }

        await transporter.sendMail(mailOptions);

        res.json({ success: ture, message: 'Verification OTP sent on Email' });

    } catch (error) {
        res.json({ success: false, message: error.message });

    }
}
