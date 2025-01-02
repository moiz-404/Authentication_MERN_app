// user.Route.js
import express from 'express';
import profileController from '../controllers/profile.Controller.js';
import { verifyJWT } from '../middlewares/verifyJWT.Middleware.js'

const router = express.Router();

// Define routes with middleware and controllers
router.route('/')
    .post(verifyJWT,profileController.createProfile)
    .get(profileController.getAllProfiles)


router.route('/:id')
    .put(verifyJWT,profileController.updateProfile)
    .get(verifyJWT,profileController.getProfile)
    .delete(verifyJWT,profileController.deleteProfile);



// Export router as default
export default router;
