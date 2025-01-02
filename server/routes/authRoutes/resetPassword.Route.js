// routes/authRoute/resetPassword.Route.js
import express from 'express';
import { resetPassword } from '../../controllers/authControllers/resetPassword.controller.js';

 
const router = express.Router();

router.post('/', resetPassword);

export default router;
