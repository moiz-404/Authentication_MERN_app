// routes/authRoutes/logout.Routes.js
import express from 'express';
import { handleLogout } from '../../controllers/authControllers/logout.Controller.js';

const router = express.Router();


/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout a user
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Logout successful
 */
// POST /auth/logout - Logout a user
router.post('/', handleLogout);

export default router;
