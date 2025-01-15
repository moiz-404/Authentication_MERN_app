// routes/authRoutes/logout.Routes.js
import express from 'express';
import handleLogout from '../../services/auth/logout.service.js';

const router = express.Router();

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: Logout a user
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.get('/', handleLogout);

export default router;
