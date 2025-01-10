import express from 'express';
import { checkAuthStatus } from '../../services/auth/check-auth-status.service.js';

const router = express.Router();


/**
 * @swagger
 * /auth/check-auth-status:
 *   get:
 *     summary: Check the authentication status of a user
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: User is authenticated
 *       401:
 *         description: Unauthorized
 */
router.get('/auth-status', checkAuthStatus);

export default router;
