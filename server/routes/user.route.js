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

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /name:
 *   put:
 *     tags:
 *       - Users
 *     summary: Update user name
 *     description: Update the name of a user.
 *     operationId: updateUserName
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *             required:
 *               - name
 *     responses:
 *       '200':
 *         description: User name updated successfully.
 *       '401':
 *         description: Unauthorized access.
 *       '400':
 *         description: Invalid input or request.
 */

/**
 * @swagger
 * /password:
 *   put:
 *     tags:
 *       - Users
 *     summary: Update user password
 *     description: Update the password of a user.
 *     operationId: updateUserPassword
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 example: newSecurePassword123
 *             required:
 *               - password
 *     responses:
 *       '200':
 *         description: User password updated successfully.
 *       '401':
 *         description: Unauthorized access.
 *       '400':
 *         description: Invalid input or request.
 */

/**
 * @swagger
 * /:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get user details
 *     description: Retrieve the details of the currently authenticated user.
 *     operationId: getUser
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: User details retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: 12345
 *                 name:
 *                   type: string
 *                   example: John Doe
 *                 email:
 *                   type: string
 *                   example: johndoe@example.com
 *       '401':
 *         description: Unauthorized access.
 */


router.route('/')
    .put(verifyJWT, UserService.updateUserName)
    .put(verifyJWT, UserService.updateUserPassword)
    .get(verifyJWT, UserService.getUser);
    // .get(usersController.getAllUsers);


// router.route('/:id')
//     .delete(verifyJWT, UserService.deleteUser);

export default router;

