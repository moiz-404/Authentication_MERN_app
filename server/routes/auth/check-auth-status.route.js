// ./routes/auth/check-auth-status.route.js
import express from 'express';
import checkAuthStatus from '../../services/auth/check-auth-status.service.js';
import verifyJWT from '../../middlewares/verify-JWT.middleware.js';

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
router.get('/', verifyJWT,checkAuthStatus);

export default router;
