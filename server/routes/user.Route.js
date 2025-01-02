// user.Route.js
import express from 'express';
import usersController from '../controllers/user.Controller.js';
import { verifyJWT } from '../middlewares/verifyJWT.Middleware.js'

const router = express.Router();

// Define routes with middleware and controllers
router.route('/')
    .get(usersController.getAllUsers)


router.route('/:id')
    .put(verifyJWT,usersController.updateUser)
    .get(verifyJWT,usersController.getUser)
    .delete(verifyJWT,usersController.deleteUser);



// Export router as default
export default router;
