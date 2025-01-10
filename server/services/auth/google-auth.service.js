// googleAuth.controller.js
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'; 
import UserModels from '../../models/user.model.js';

const googleAuth = async (req, res, next) => {
  try {
    const { email, name, photo } = req.body;

    // Check if the user already exists in the database
    let user = await User.findOne({ email });

    if (user) {
      // User exists, generate a JWT token and send the response
      const token = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
      const { password, ...rest } = user._doc;

      return res
        .cookie('jwt_accessToken', token, {
          httpOnly: true,
          expires: new Date(Date.now() + 3600000), // 1 hour
        })
        .status(200)
        .json(rest);
    }

    // User doesn't exist, create a new user
    const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);

    user = new User({
      username: name.replace(/\s+/g, '').toLowerCase() + Math.random().toString(36).slice(-8),
      email,
      password: hashedPassword,
      profilePicture: photo, // Store photo as URL, not as a Buffer
    });

    // Save the new user
    await user.save();

    // Generate JWT token for the new user
    const token = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
    const { password: hashedPassword2, ...rest } = user._doc;

    return res
      .cookie('jwt_accessToken', token, {
        httpOnly: true,
        expires: new Date(Date.now() + 3600000), // 1 hour
      })
      .status(200)
      .json(rest);
    
  } catch (error) {
    console.error('Error during Google Auth:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

export default googleAuth;
 