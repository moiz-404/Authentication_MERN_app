// routes/authRoute/sendPasswordResetOtp.Route.js
import express from 'express';
import { sendPasswordResetOtp } from '../../controllers/authControllers/sendPasswordResetOtp.Controller.js';


const router = express.Router();

router.post('/', sendPasswordResetOtp);

export default router;
