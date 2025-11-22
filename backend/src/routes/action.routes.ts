import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import * as actionController from '../controllers/action.controller';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

/**
 * POST /api/actions
 * Register a new sustainable action
 */
router.post('/', actionController.logAction);

/**
 * GET /api/actions
 * Get all actions of the user
 */
router.get('/', actionController.getMyActions);

/**
 * GET /api/actions/stats
 * Get the user's action statistics (including current streak)
 */
router.get('/stats', actionController.getMyStats);

export default router;
