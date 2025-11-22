import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import * as userController from '../controllers/user.controller';

const router = Router();

/**
 * User Profile Routes
 * All routes require authentication
 */

// Get comprehensive user profile
router.get('/profile', authMiddleware, userController.getUserProfile);

// Get detailed streak information
router.get('/streak', authMiddleware, userController.getStreakDetails);

// Get user activity statistics
router.get('/stats', authMiddleware, userController.getUserStats);

export default router;
