import express from 'express';
import { checkAuthStatus } from '../../controllers/authControllers/checkAuthStatus.Controller.js';

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
