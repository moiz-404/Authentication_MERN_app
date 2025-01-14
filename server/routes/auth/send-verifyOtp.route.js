// routes/authRoute/sendVerifyOtp.Route.js
import express from 'express';
import sendVerifyOtp from '../../services/auth/send-verifyOtp.service.js';
import verifyJWT from '../../middlewares/verify-JWT.middleware.js'


const router = express.Router();

/**
 * @swagger
 * /auth/send-verify-otp:
 *   post:
 *     summary: Send an account verification OTP
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
router.post('/', verifyJWT, sendVerifyOtp);

export default router;
