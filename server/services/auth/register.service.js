// controllers/authController/register.Controller.js
import UserModels from '../../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import transporter from '../../config/node-mailer.js';

// Handler for registering a new user
export const handleRegister = async (req, res) => {
    const { username, email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        // Check for duplicate email in the database
        const emailDuplicate = await UserModels.findOne({ email }).exec();
        if (emailDuplicate) {
            return res.status(409).json({ message: 'Email already exists.' });
        }

        // Encrypt the password
        const hashedPassword = await bcrypt.hashSync(password, 10);

        // Create and store the new user
        const newUser = await UserModels.create({
            username,
            email,
            password: hashedPassword
        });

        // Create JWTs
        const token = jwt.sign(
            { "id": newUser._id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        // Save Token with the current user
        newUser.token = token;
        await newUser.save();

        // Set secure cookie with token
        res.cookie('jwt_accessToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : '',
            expires: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours
        });

        // sending welcome email
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

        // Return success response with username and email
        res.status(201).json({
            success: `New user ${newUser.username} created successfully!`,
            newUser
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};