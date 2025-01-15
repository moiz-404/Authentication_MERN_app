// user.route.js
import express from 'express';
import UserService from '../services/user.service.js';
import verifyJWT from '../middlewares/verify-JWT.middleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API for managing users
 */

router.route('/')
    .put(verifyJWT, UserService.updateUserName)
    .put(verifyJWT, UserService.updateUserPassword)
    .get(verifyJWT, UserService.getUser);
    // .get(usersController.getAllUsers);


// router.route('/:id')
//     .delete(verifyJWT, UserService.deleteUser);

export default router;

