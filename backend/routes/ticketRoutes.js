import express from 'express';
import { protect, isAdmin } from '../middleware/authMiddleware.js';
import {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
  getAllTickets,
  assignTicket,
  resolveTicket,
  getTicketNotes,
  createTicketNote,
} from '../controllers/ticketController.js';

const router = express.Router();



// GET /api/tickets → Get all tickets for logged-in user
// POST /api/tickets → Create new ticket
router
  .route('/')
  .get(protect, getTickets)
  .post(protect, createTicket);

// GET /api/tickets/:id → Get single ticket
// PUT /api/tickets/:id → Update ticket
// DELETE /api/tickets/:id → Delete ticket
router
  .route('/:id')
  .get(protect, getTicketById)
  .put(protect, updateTicket)
  .delete(protect, deleteTicket);



// GET /api/tickets/:id/notes → Get notes for ticket
// POST /api/tickets/:id/notes → Add note to ticket
router
  .route('/:id/notes')
  .get(protect, getTicketNotes)
  .post(protect, createTicketNote);



// GET /api/tickets/all → Get all tickets (admin only)
router.get('/all', protect, isAdmin, getAllTickets);

// PUT /api/tickets/:id/assign → Assign ticket (admin only)
router.put('/:id/assign', protect, isAdmin, assignTicket);

// PUT /api/tickets/:id/resolve → Resolve ticket (admin only)
router.put('/:id/resolve', protect, isAdmin, resolveTicket);

export default router;
