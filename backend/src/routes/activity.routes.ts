import { Router } from 'express';
import { deleteActivity, getActivity, getUserActivities, newActivity } from '../controllers/activity.controller';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.use(authenticateToken)

router.get('/:id', getActivity);

router.get('/user/:id', getUserActivities);

router.post('/', newActivity);

router.delete('/:id', deleteActivity);

export default router;
