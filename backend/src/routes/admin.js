import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { getStats } from '../controllers/adminController.js';

const router = express.Router();

router.get('/stats', authenticate, async (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
  return getStats(req, res, next);
});

export default router;
