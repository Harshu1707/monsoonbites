import { Router } from 'express';
import { stats } from '../controllers/adminController.js';
import { adminOnly, protect } from '../middleware/authMiddleware.js';
const router = Router();
router.get('/stats', protect, adminOnly, stats);
export default router;
