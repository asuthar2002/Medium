import express from 'express';
import multer from 'multer';
import { authenticate } from '../middleware/auth.js';
import { getMyProfile, updateMyProfile, listUsers, deleteUser, getUserProfile, suspendUser, unsuspendUser } from '../controllers/userController.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
  next();
}

router.get('/me', authenticate, getMyProfile);
router.put('/me', authenticate, upload.single('profileImage'), updateMyProfile);
router.get('/', authenticate, listUsers);
router.delete('/:id', authenticate, requireAdmin, deleteUser);
router.patch('/:id/suspend', authenticate, requireAdmin, suspendUser);
router.patch('/:id/unsuspend', authenticate, requireAdmin, unsuspendUser);
router.get('/:id', getUserProfile);

export default router;
