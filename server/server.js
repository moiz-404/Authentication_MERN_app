// server.js
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import connectDB from './config/dbconn.js';
import corsOptions from './config/cors-options.js';
import logEvents from './middlewares/log-events.middleware.js';
import errorHandler from './middlewares/error-Handler.middleware.js';
import credentials from './middlewares/credentials.middleware.js';
import logger from './config/logger.js';

import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import swaggerOptions from './config/swagger.js';

import userProfile from './routes/user-profile.route.js';
import register from './routes/auth/register.route.js';
import login from './routes/auth/login.route.js';
import logout from './routes/auth/logout.route.js';
import refreshTokken from './routes/auth/refresh-token.route.js';
import sendVerifyOtp from './routes/auth/send-verifyOtp.route.js';
import verifyAccount from './routes/auth/verify-account.route.js';
import sendPasswordResetOtp from './routes/auth/send-password-resetOtp.route.js';
import resetPassword from './routes/auth/reset-password.route.js';
import authStatus from './routes/auth/check-auth-status.route.js';
import googleAuth from './routes/auth/google-0auth.route.js';
import verifyJWT from './middlewares/verify-JWT.middleware.js';

// Load environment variables
dotenv.config();

const app = express();

const PORT = process.env.PORT || 3500;

const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Connect to MongoDB
connectDB();

// custom middleware logger
app.use(logEvents);

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json 
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

//serve static files
// app.use('/', express.static(path.join(__dirname, '/public')));
app.use(express.static(path.resolve('public')));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
// Define routes
app.use('/api/register', register);
app.use('/api/login', login);
app.use('/api/logout', logout);
app.use('/api/refreshtoken', refreshTokken);
app.use('/api/VerifyOtp', sendVerifyOtp);
app.use('/api/verifyAccount', verifyAccount);
app.use('/api/sendPasswordResetOtp', sendPasswordResetOtp);
app.use('/api/resetPassword', resetPassword);
app.use('/api/authStatus', authStatus);
app.use('/api/googleAuth', googleAuth);

// Middleware to verify JWT for protected routes
app.use(verifyJWT);
app.use('/api/user-profile', userProfile);

// Handle 404 - Not Found
app.all('*', (req, res) => {
  logger.warn(`404 Not Found: ${req.method} ${req.url}`);
  res.status(404).json({ error: '404 Not Found' });
});

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

// Global error handler middleware
app.use(errorHandler);