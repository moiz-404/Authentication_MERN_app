// routes/authRoute/register.Route.js
import express from 'express';
import { handleRegister } from '../../controllers/authControllers/register.Controller.js';

const router = express.Router();

// POST /auth/register - Register a new user
router.post('/', handleRegister);

export default router;
