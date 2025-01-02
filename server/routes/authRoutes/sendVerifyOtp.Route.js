// routes/authRoute/sendVerifyOtp.Route.js
import express from 'express';
import { sendVerifyOtp } from '../../controllers/authControllers/sendVerifyOtp.Controller.js';
import { verifyJWT } from '../../middlewares/verifyJWT.Middleware.js'


const router = express.Router();

router.post('/', verifyJWT, sendVerifyOtp);

export default router;
