// routes/authRoute/verifyAccount.Route.js
import express from 'express';
import { verifyEmail } from '../../controllers/authControllers/verifyEmail.Controller.js';
import { verifyJWT } from '../../middlewares/verifyJWT.Middleware.js'


const router = express.Router();

router.post('/', verifyJWT, verifyEmail);

export default router;
