import express from 'express';
const router = express.Router();

import {
  registerUser,
  authUser,
  getUserById,
} from '../controllers/userController.js';

import { protect, isAdmin } from '../middleware/authMiddleware.js';

// @route   POST /api/users
// @desc    Register user
router.post('/', registerUser);

// @route   POST /api/users/login
// @desc    Login user
router.post('/login', authUser);

// @route   GET /api/users/:id
// @desc    Get user by ID (admin only)
router.get('/:id', protect, isAdmin, getUserById);

// ✅ Export the router
export default router;

