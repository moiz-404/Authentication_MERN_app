// googleAuth.Route.js
import express from 'express';
import googleAuth from '../../controllers/authControllers/googleAuth.controller.js';  // Named import

const router = express.Router();



router.post('/', googleAuth);

export default router;
