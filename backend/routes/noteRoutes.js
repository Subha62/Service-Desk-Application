import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getNotes, addNote } from '../controllers/noteController.js';

const router = express.Router({ mergeParams: true });

/**
 * @route   GET /api/tickets/:ticketId/notes
 * @desc    Get all notes for a ticket
 * @access  Private
 */

/**
 * @route   POST /api/tickets/:ticketId/notes
 * @desc    Add a new note to a ticket
 * @access  Private
 */

router
  .route('/')
  .get(protect, getNotes)
  .post(protect, addNote);

export default router;



