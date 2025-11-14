import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';
import { actionsController } from '../controllers/actions.controller';

const router = Router();

// POST /action - Create new action with file upload
router.post('/', authMiddleware, upload.single('image'), (req, res) => actionsController.create(req, res));

// GET /actions/my-actions - Get user's actions
router.get('/my-actions', authMiddleware, (req, res) => actionsController.myActions(req, res));

export default router;

