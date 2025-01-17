// ./services/auth/googleAuth.service.js
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import UserModels from '../../models/user.model.js';

const googleAuth = async (req, res, next) => {
    try {
        const { email, name, photo } = req.body;

        let user = await UserModels.findOne({ email });

        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
            const { password, ...rest } = user._doc;

            return res.cookie('jwt_Token', token, {
                httpOnly: true,
                expires: new Date(Date.now() + 3600000),
            }).status(200).json({ message: 'Logged in successfully' }, rest);
        }

        const generatedPassword = `${Math.random().toString(36).slice(-8)}${Math.random().toString(36).slice(-8)}`;
        const hashedPassword = await bcrypt.hash(generatedPassword, 10);

        const newProfile = new ProfileModel({});
        await newProfile.save();

        user = await new UserModels.create({
            username: `${name.replace(/\s+/g, '').toLowerCase()}${Date.now()}`,
            email,
            password: hashedPassword,
            profilePicture: photo,
            profile: newProfile._id,
        });

        const token = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
        const { password: _, ...rest } = user._doc;

        return res
            .cookie('jwt_Token', token, {
                httpOnly: true,
                expires: new Date(Date.now() + 3600000),
            }).status(200).json({ message: 'Logged in successfully' }, rest);
    } catch (error) {
        console.error('Error during Google Auth:', error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

export default googleAuth;

