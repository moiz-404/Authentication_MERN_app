// ./config/dbconn.js
import mongoose from 'mongoose';
import logger from './logger.js'; 

const connectDB = async () => {
    try {
        // Log the attempt to connect
        logger.info('Attempting to connect to MongoDB...');
        mongoose.connection.on('connected', () => {
            // Log when the database connection is successful
            logger.info('MongoDB connected successfully.');
        })
        await mongoose.connect(process.env.DATABASE_URI,);
    } catch (error) {
        // Log any failure in the connection attempt
        logger.error(`Failed to connect to MongoDB: ${error.message}`);
        throw error; // Re-throw the error for further handling
    }
};

export default connectDB;