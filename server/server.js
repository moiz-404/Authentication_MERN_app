import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan'; // Import Morgan
import logger from './config/logger.js'; // Import the Winston logger

import connectDB from './config/dbconn.js';
import corsOptions from './config/cors-options.js';
import errorHandler from './middlewares/error-Handler.middleware.js';
import credentials from './middlewares/credentials.middleware.js';

import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import swaggerOptions from './config/swagger.js';

import Profile from './routes/profile.route.js';
import User from './routes/user.route.js';
import register from './routes/auth/register.route.js';
import login from './routes/auth/login.route.js';
import logout from './routes/auth/logout.route.js';
import refreshToken from './routes/auth/refresh-token.routes.js';
import sendVerifyOtp from './routes/auth/send-verifyOtp.route.js';
import verifyAccount from './routes/auth/verify-account.route.js';
import sendPasswordResetOtp from './routes/auth/send-password-resetOtp.route.js';
import resetPassword from './routes/auth/reset-password.route.js';
import checkAuthStatus from './routes/auth/check-auth-status.route.js';
import googleAuth from './routes/auth/google-0auth.route.js';
import verifyJWT from './middlewares/verify-JWT.middleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3500;
const swaggerDocs = swaggerJsdoc(swaggerOptions);
 
// Connect to MongoDB
connectDB();

// Custom format for HTTP request logs (to exclude the unwanted parts)
const customMorganFormat = ':method :url :status :response-time ms - :res[content-length] ":referrer" ":user-agent"';

// Use morgan with the custom format
app.use(morgan(customMorganFormat, {
  stream: {
    write: (message) => logger.info(message.trim()), // Logging to winston with the custom format
  }
}));

// Handle options credentials check - before CORS!
app.use(credentials);

// Cross-Origin Resource Sharing (CORS)
app.use(cors(corsOptions));

// Built-in middleware to handle URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Built-in middleware for JSON
app.use(express.json());

// Middleware for cookies
app.use(cookieParser());

// Serve static files
app.use(express.static(path.resolve('public')));

// Set up Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Public routes (No JWT required)
app.use('/api/register', register);
app.use('/api/login', login);
app.use('/api/logout', logout);
app.use('/api/refreshtoken', refreshToken);
app.use('/api/VerifyOtp', sendVerifyOtp);
app.use('/api/verifyAccount', verifyAccount);
app.use('/api/sendPasswordResetOtp', sendPasswordResetOtp);
app.use('/api/resetPassword', resetPassword);
app.use('/api/checkAuthStatus', checkAuthStatus);
app.use('/api/googleAuth', googleAuth);

// Middleware to verify JWT for protected routes
app.use(verifyJWT); // After the public routes

// Protected routes (JWT required)
app.use('/api/user', User);
app.use('/api/profile', Profile);

// Handle 404 - Not Found
app.all('*', (req, res) => {
  logger.warn(`404 Not Found: ${req.method} ${req.url}`);
  res.status(404).json({ error: '404 Not Found' });
});

// Global error handler middleware
app.use(errorHandler);

// Start the server
try {
  app.listen(PORT, () => {
    logger.info(`Server running on http://localhost:${PORT}`);
    logger.info(`Swagger Docs running on http://localhost:${PORT}/api-docs`);
  });
} catch (error) {
  logger.error('Server startup failed:', error.message);
  process.exit(1); // Graceful exit on failure
}
