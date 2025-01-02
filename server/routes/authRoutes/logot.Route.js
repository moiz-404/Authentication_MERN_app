// routes/authRoutes/logout.Routes.js
import express from 'express';
import { handleLogout } from '../../controllers/authControllers/logout.Controller.js';

const router = express.Router();

// POST /auth/logout - Logout a user
router.post('/', handleLogout);

export default router;
