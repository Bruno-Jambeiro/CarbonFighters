import { Router } from 'express';
import { groupController } from '../controllers/group.controller';
// Import the authentication middleware
import { authMiddleware } from '../middleware/auth.middleware'; 

const router = Router();

// --- Protected Routes ---
// Apply 'authMiddleware' to all routes in this file.
// This means no one can access them without a valid JWT.

/**
 * @route POST /groups
 * @desc Create a new group
 * @access Private
 */
router.post('/', authMiddleware, groupController.createGroup);

/**
 * @route POST /groups/join
 * @desc Join a group with an invite code
 * @access Private
 */
router.post('/join', authMiddleware, groupController.joinGroup);

/**
 * @route GET /groups/my-groups
 * @desc Get all groups for the logged-in user
 * @access Private
 */
router.get('/my-groups', authMiddleware, groupController.getMyGroups);

/**
 * @route GET /groups/:groupId/actions
 * @desc Get all actions by members of a group
 * @access Private
 */
router.get('/:groupId/actions', authMiddleware, (req, res) => groupController.getGroupActions(req, res));

export default router;