// routes/authRoute/sendPasswordResetOtp.Route.js
import express from 'express';
import { sendPasswordResetOtp } from '../../services/auth/send-password-resetOtp.service.js';


const router = express.Router();

/**
 * @swagger
 * /auth/send-password-reset-otp:
 *   post:
 *     summary: Send a password reset OTP to the user's email
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *       400:
 *         description: Error sending OTP
 */
router.post('/', sendPasswordResetOtp);

export default router;
