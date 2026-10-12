import { Router } from 'express';
import {
  getAdminOverview,
  getAllUsers,
  updateUserRole,
  getAllReports,
  updateReportStatus,
  getContactMessages,
  updateContactMessageStatus
} from '../controllers/adminController.js';
import { createReport } from '../controllers/reportController.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();

// User report endpoint
router.post('/report', requireAuth, createReport);

// Protected Admin endpoints
router.get('/overview', requireAdmin, getAdminOverview);
router.get('/users', requireAdmin, getAllUsers);
router.patch('/users/:id/role', requireAdmin, updateUserRole);
router.get('/reports', requireAdmin, getAllReports);
router.patch('/reports/:id', requireAdmin, updateReportStatus);
router.get('/messages', requireAdmin, getContactMessages);
router.patch('/messages/:id', requireAdmin, updateContactMessageStatus);

export default router;
