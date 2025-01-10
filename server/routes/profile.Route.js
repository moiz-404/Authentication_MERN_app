// user.Route.js
import express from 'express';
import profileController from '../services/profile.service.js';
import { verifyJWT } from '../middlewares/verify-JWT.middleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Profiles
 *   description: API for managing user profiles
 */
/**
 * @swagger
 * /profiles:
 *   post:
 *     summary: Create a new user profile
 *     tags: [Profiles]
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
 *               email:
 *                 type: string
 *               age:
 *                 type: integer
 *             required:
 *               - name
 *               - email
 *     responses:
 *       201:
 *         description: Profile created successfully
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Bad request
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *       500:
 *         description: Internal server error
 */

router.route('/')
    .post(verifyJWT, profileController.createProfile)
    .get(profileController.getAllProfiles);

/**
 * @swagger
 * /{id}:
 *   put:
 *     summary: Update a user profile
 *     tags: [Profiles]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               age:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Profile not found
 *   get:
 *     summary: Get a user profile by ID
 *     tags: [Profiles]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User profile found
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Profile not found
 *   delete:
 *     summary: Delete a user profile
 *     tags: [Profiles]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Profile deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Profile not found
 */
router.route('/:id')
    .put(verifyJWT, profileController.updateProfile)
    .get(verifyJWT, profileController.getProfile)
    .delete(verifyJWT, profileController.deleteProfile);

// Export router as default
export default router;
