
import express from 'express';
import { register, login, verifyOtp, sendOtp, requestPasswordReset, resetPassword, refreshToken, fetchUser } from '../controllers/authController.js';
import { body } from 'express-validator';
import upload from '../middleware/upload.middleware.js';

const router = express.Router();
router.post('/register', upload.single('profileImage'), register);

router.post('/login', login);
router.post('/verify-otp', verifyOtp);
router.get('/fetchUser', fetchUser)
router.post('/refresh-token', refreshToken)

router.post('/request-password-reset', [
  body('email').isEmail().withMessage('Valid email required'),
], requestPasswordReset);

router.post('/reset-password', [
  body('token').notEmpty(),
  body('password').isLength({ min: 6 }),
], resetPassword);

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);

router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);

export default router;
