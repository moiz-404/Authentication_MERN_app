// userprofile.route.js
import express from 'express';
import ProfileService from '../services/profile.service.js';
import verifyJWT from '../middlewares/verify-JWT.middleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: userProfiles
 *   description: API for managing user profiles
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
 * /profile:
 *   put:
 *     summary: Update user profile
 *     description: Update the details of a user's profile. Requires authentication.
 *     tags: [userProfiles]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       description: The updated profile information
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               bio:
 *                 type: string
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized, invalid token
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Get user profile
 *     description: Fetch the details of the authenticated user's profile.
 *     tags: [userProfiles]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 bio:
 *                   type: string
 *       401:
 *         description: Unauthorized, invalid token
 *       404:
 *         description: User profile not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /profile:
 *   delete:
 *     summary: Delete user profile
 *     description: Delete the authenticated user's profile. Requires authentication.
 *     tags: [userProfiles]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User profile deleted successfully
 *       401:
 *         description: Unauthorized, invalid token
 *       500:
 *         description: Server error
 */

router.route('/')
    .put(verifyJWT, ProfileService.updateProfile)
    .get(verifyJWT, ProfileService.getProfile)
    .delete(verifyJWT, ProfileService.deleteProfile);

export default router;
