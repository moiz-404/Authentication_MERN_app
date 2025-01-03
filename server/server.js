// server.js
// Import necessary modules
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import connectDB from './config/dbconn.js';

import userRoutes from './routes/user.Route.js';
import profileRoutes from './routes/profile.Route.js';
import registerRoute from './routes/authRoutes/register.Route.js';
import loginRoute from './routes/authRoutes/login.Route.js';
import logoutRoute from './routes/authRoutes/logot.Route.js';
import sendVerifyOtp from './routes/authRoutes/sendVerifyOtp.Route.js';
import verifyAccount from './routes/authRoutes/verifyAccount.Route.js';
import sendPasswordResetOtp from './routes/authRoutes/sendPasswordResetOtp.Route.js';
import resetPassword from './routes/authRoutes/resetPassword.Route.js';
import authStatus from './routes/authRoutes/checkAuthStatus.Route.js';
import googleAuth from './routes/authRoutes/googleAuth.Route.js';
// import verifyJWT from './middleware/verifyJWT.js';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import swaggerOptions from './config/swagger.js';

const swaggerDocs = swaggerJsdoc(swaggerOptions);



// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3500;

// Connect to MongoDB
connectDB();

// Middleware setup

// Middleware to parse JSON body
app.use(express.json());
// Handle cookie
app.use(cookieParser());
// Enable CORS for all routes
app.use(cors({
  origin: 'http://localhost:3000', // Replace with your frontend URL
  credentials: true, // Allow cookies
}));

// Serve static files
app.use(express.static(path.resolve('public')));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
// Define routes
app.use('/api/register', registerRoute);
app.use('/api/login', loginRoute);
app.use('/api/logout', logoutRoute);
app.use('/api/VerifyOtp', sendVerifyOtp);
app.use('/api/verifyAccount', verifyAccount);
app.use('/api/sendPasswordResetOtp', sendPasswordResetOtp);
app.use('/api/resetPassword', resetPassword);
app.use('/api/authStatus', authStatus);
app.use('/api/googleAuth', googleAuth);

// Middleware to verify JWT for protected routes
// app.use(verifyJWT);

app.use('/api/user', userRoutes);
app.use('/api/profile', profileRoutes);

// Handle 404 - Not Found
app.all('*', (req, res) => {
  res.status(404).json({ error: '404 Not Found' });
});




// start the server
try {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Swagger Doc Api's running on http://localhost:${PORT}/api-docs`);
  });
} catch (error) {
  console.error('Database connection failed:', error.message);
  process.exit(1); // Graceful exit on database failure
}




app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});