import express from 'express';
import passport from '../passport.js';
import { googleCallback } from '../controllers/authController.js';

const router = express.Router();

router.get('/', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/callback',
  passport.authenticate('google', { session: false, failureRedirect: process.env.CLIENT_URL + '/login' }),
  googleCallback
);

export default router;
