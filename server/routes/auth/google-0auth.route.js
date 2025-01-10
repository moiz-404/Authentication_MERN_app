// googleAuth.Route.js
import express from 'express';
import googleAuth from '../../services/auth/google-auth.service.js';  // Named import

const router = express.Router();



router.post('/', googleAuth);

export default router;
