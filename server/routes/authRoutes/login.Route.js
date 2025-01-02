// routes/authRoutes/login.Routes.js
import express from 'express';
import { handleLogin } from '../../controllers/authControllers/login.Controller.js';

const router = express.Router();

// POST /auth/login - Login an existing user
router.post('/', handleLogin);

export default router;
