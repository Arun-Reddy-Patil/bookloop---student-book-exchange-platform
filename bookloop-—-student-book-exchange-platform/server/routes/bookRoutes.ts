import { Router } from 'express';
import {
  getAllBooks,
  getFeaturedBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  getUserListings,
  getPlatformStats
} from '../controllers/bookController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/featured', getFeaturedBooks);
router.get('/stats', getPlatformStats);
router.get('/user/my-listings', requireAuth, getUserListings);
router.get('/:id', getBookById);
router.get('/', getAllBooks);
router.post('/', requireAuth, createBook);
router.put('/:id', requireAuth, updateBook);
router.delete('/:id', requireAuth, deleteBook);

export default router;
