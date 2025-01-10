import mongoose from 'mongoose';
const { Schema } = mongoose;

// Profile schema
const profileSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateOfBirth: { type: Date },
    phone: { type: String },
    address: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        zipCode: { type: String }
    },
    bio: { type: String },
    profilePicture: {
        type: String,
        default: 'https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg',
    }
}, { timestamps: true });

const Profile = mongoose.models.Profile || mongoose.model('Profile', profileSchema);

export default Profile;
