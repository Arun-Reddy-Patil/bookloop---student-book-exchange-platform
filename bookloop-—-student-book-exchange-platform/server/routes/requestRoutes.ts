import { Router } from 'express';
import {
  createRequest,
  getSentRequests,
  getReceivedRequests,
  updateRequestStatus
} from '../controllers/requestController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/', requireAuth, createRequest);
router.get('/sent', requireAuth, getSentRequests);
router.get('/received', requireAuth, getReceivedRequests);
router.patch('/:id/status', requireAuth, updateRequestStatus);

export default router;
