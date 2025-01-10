// routes/authRoute/resetPassword.Route.js
import express from 'express';
import { resetPassword } from '../../services/auth/reset-password.service.js';


const router = express.Router();

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset the user's password
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
 *               newPassword:
 *                 type: string
 *               resetToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid token or request data
 */
router.post('/', resetPassword);

export default router;
