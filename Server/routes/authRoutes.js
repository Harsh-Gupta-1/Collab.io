import express from 'express';
import { signup, login, getProfile } from '../controllers/authController.js';
import { validateSignup, validateLogin } from '../middlewares/validation.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

// Public routes
router.post('/signup', validateSignup, signup);
router.post('/login', validateLogin, login);

// Protected routes
router.get('/profile', protect, getProfile);

export default router;