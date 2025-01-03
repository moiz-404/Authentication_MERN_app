import mongoose from 'mongoose';
// import Profile from './Profile';  // Import Profile schema

const { Schema } = mongoose;

// User schema
const userSchema = new Schema({
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    //   role: { type: String, enum: ['user', 'admin', 'moderator'], default: 'user' },
    profile: { type: Schema.Types.ObjectId, ref: 'Profile' },  // Reference to Profile model
    verfyOtp: { type: String, default: '' },  // OTP code for verification
    verfyOtpExpiresAt: { type: Number, default: 0 },  // Expiration time of the OTP
    PasswordResetOtp: { type: String, default: '' },  // OTP code for verification
    PasswordResetOtpExpiresAt: { type: Number, default: 0 },  // Expiration time of the OTP
    token: String,
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
 