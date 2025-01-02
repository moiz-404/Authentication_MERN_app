import express from 'express';
import { checkAuthStatus } from '../../controllers/authControllers/checkAuthStatus.Controller.js';

const router = express.Router();

router.get('/auth-status', checkAuthStatus);

export default router;
