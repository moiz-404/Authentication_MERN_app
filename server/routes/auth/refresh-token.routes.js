// routes/auth/logout.Routes.js
import express from 'express';
import handleRefreshToken from '../../services/auth/refresh-token.service.js';

const router = express.Router();

/**
 * @swagger
 * /auth/refresh-token:
 *   get:
 *     summary: Refreshes the access token using the refresh token from the cookies
 *     description: This endpoint allows the client to refresh the access token using a valid refresh token stored in the cookies.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: The refresh token used to generate the new access token
 *                 example: "your-refresh-token"
 *     responses:
 *       200:
 *         description: Successfully refreshed the access token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Token refreshed successfully"
 *                 accessToken:
 *                   type: string
 *                   description: The new access token
 *                   example: "your-new-access-token"
 *       401:
 *         description: No refresh token provided in the cookies
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Refresh token not found"
 *       403:
 *         description: Invalid or expired refresh token, or user mismatch with token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Forbidden"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error, please try again later"
 *     security:
 *       - cookieAuth: []
 */

router.get('/', handleRefreshToken);

export default router;
