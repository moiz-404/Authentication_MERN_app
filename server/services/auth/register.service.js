// services/auths/register.service.js
import UserModels from '../../models/user.model.js';
import ProfileModel from '../../models/profile.model.js'; 
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import logger from '../../config/logger.js';

const handleRegister = async (req, res) => {
    const { username, email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        const emailDuplicate = await UserModels.findOne({ email });
        if (emailDuplicate) {
            return res.status(409).json({ message: 'Registration failed: Email already in use.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newProfile = new ProfileModel({});
        await newProfile.save();

        const newUser = await UserModels.create({
            username,
            email,
            password: hashedPassword,
            profile: newProfile._id,
        });

        const token = jwt.sign(
            { userId: newUser._id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' }
        );

        const refreshToken = jwt.sign(
            { userId: newUser._id },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '7d' }
        );

        newUser.refreshToken = refreshToken;
        await newUser.save();

        res.cookie('jwt_Token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'Lax',
            expires: new Date(Date.now() + 2 * 60 * 60 * 1000),
        });

        // sending welcome email (optional)
        // const mailOptions = {
        //     from: process.env.SENDER_EMAIL, // Sender's email
        //     to: user.email,// Recipient's email
        //     subject: 'welcome to ',
        //     text: `welcome to our website. Your account has been created with email is:${email} `,
        // }

        // const sendMail = async (transporter,mailOptions) => {
        //     try {
        //         await transporter.sendMail(mailOptions);
        //         res.status(201).json({
        //             success: `Email has been sent successfully!`,
        //         });
        //     } catch (error) {
        //         console.error(err);
        //         res.status(500).json({ message: 'Internal Server Error' });
        //     }
        // }
        // sendMail(transporter,mailOptions)

        logger.info(`New user ${newUser.username} created successfully with email ${email}`);

        res.status(201).json({
            success: `New user ${newUser.username} created successfully!`,
            newUser, token
        });
    } catch (err) {
        logger.error(`Error during user registration: ${err.message}`);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
export default handleRegister;