import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import * as badgeController from '../controllers/badge.controller';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

/**
 * GET /badges
 * Obtains all available badges
 */
router.get('/', badgeController.getAllBadges);

/**
 * GET /badges/my-badges
 * Obtains the badges earned by the user
 */
router.get('/my-badges', badgeController.getMyBadges);

/**
 * GET /badges/notifications
 * Obtains the user's notifications
 */
router.get('/notifications', badgeController.getMyNotifications);

/**
 * PUT /badges/notifications/:id/read
 * Marks a notification as read
 */
router.put('/notifications/:id/read', badgeController.markNotificationRead);

/**
 * PUT /badges/notifications/read-all
 * Marks all notifications as read
 */
router.put('/notifications/read-all', badgeController.markAllNotificationsRead);

export default router;
