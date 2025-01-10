// routes/authRoute/verifyAccount.Route.js
import express from 'express';
import { verifyEmail } from '../../services/auth/verify-email.service.js';
import { verifyJWT } from '../../middlewares/verify-JWT.middleware.js'


const router = express.Router();

/**
 * @swagger
 * /auth/verify-account:
 *   post:
 *     summary: Verify the user's account using an OTP
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
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: Account verified successfully
 *       400:
 *         description: Invalid OTP or email
 */

router.post('/', verifyJWT, verifyEmail);

export default router;
