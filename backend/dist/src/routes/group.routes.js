"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const group_controller_1 = require("../controllers/group.controller");
// Import the authentication middleware
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// --- Protected Routes ---
// Apply 'authMiddleware' to all routes in this file.
// This means no one can access them without a valid JWT.
/**
 * @route POST /groups
 * @desc Create a new group
 * @access Private
 */
router.post('/', auth_middleware_1.authMiddleware, group_controller_1.groupController.createGroup);
/**
 * @route POST /groups/join
 * @desc Join a group with an invite code
 * @access Private
 */
router.post('/join', auth_middleware_1.authMiddleware, group_controller_1.groupController.joinGroup);
/**
 * @route GET /groups/my-groups
 * @desc Get all groups for the logged-in user
 * @access Private
 */
router.get('/my-groups', auth_middleware_1.authMiddleware, group_controller_1.groupController.getMyGroups);
exports.default = router;
