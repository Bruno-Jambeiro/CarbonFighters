// backend/src/routes/user.routes.ts
import { Router } from 'express';
import { getUserDashboard } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Protected route - requires authentication
router.get('/dashboard', authenticate, getUserDashboard);

export default router;
