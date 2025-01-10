// ./config/dbconn.js
import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => console.log("MongoDB connected successfully"))
        await mongoose.connect(process.env.DATABASE_URI, );
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error.message);
        throw error; // Re-throw the error for further handling
    }
};

export default connectDB;