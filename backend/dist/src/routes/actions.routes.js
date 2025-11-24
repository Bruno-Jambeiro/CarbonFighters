"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const upload_middleware_1 = require("../middleware/upload.middleware");
const actions_controller_1 = require("../controllers/actions.controller");
const router = (0, express_1.Router)();
// POST /action - Create new action with file upload
router.post('/', auth_middleware_1.authMiddleware, upload_middleware_1.upload.single('image'), (req, res) => actions_controller_1.actionsController.create(req, res));
// GET /actions/my-actions - Get user's actions
router.get('/my-actions', auth_middleware_1.authMiddleware, (req, res) => actions_controller_1.actionsController.myActions(req, res));
exports.default = router;
