import asyncHandler from 'express-async-handler';
import Ticket from '../models/ticketModel.js';
import User from '../models/userModel.js';
import Note from '../models/noteModel.js';

/**
 * @desc    Create a new ticket
 * @route   POST /api/tickets
 * @access  Private
 */
export const createTicket = asyncHandler(async (req, res) => {
  
  const category = req.body.category?.trim();
  const product = req.body.product?.trim();
  const priority = req.body.priority?.trim();
  const description = req.body.description?.trim();

  if (!category || !product || !priority || !description) {
    res.status(400);
    throw new Error('Please fill in all required fields: category, product, priority, description.');
  }

  const ticket = await Ticket.create({
    user: req.user.id,
    category,
    product,
    priority,
    description,
    status: 'Open',
  });

  res.status(201).json(ticket);
});

/**
 * @desc    Get all tickets for logged-in user
 * @route   GET /api/tickets
 * @access  Private
 */
export const getTickets = asyncHandler(async (req, res) => {
  const tickets = await Ticket.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.status(200).json(tickets);
});

/**
 * @desc    Get a single ticket
 * @route   GET /api/tickets/:id
 * @access  Private
 */
export const getTicketById = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    res.status(404);
    throw new Error('Ticket not found.');
  }

  if (ticket.user.toString() !== req.user.id && !req.user.isAdmin) {
    res.status(403);
    throw new Error('Not authorized to view this ticket.');
  }

  res.status(200).json(ticket);
});

/**
 * @desc    Update a ticket
 * @route   PUT /api/tickets/:id
 * @access  Private
 */
export const updateTicket = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    res.status(404);
    throw new Error('Ticket not found.');
  }

  if (ticket.user.toString() !== req.user.id && !req.user.isAdmin) {
    res.status(403);
    throw new Error('Not authorized to update this ticket.');
  }

  const updates = {
    category: req.body.category?.trim() || ticket.category,
    product: req.body.product?.trim() || ticket.product,
    priority: req.body.priority?.trim() || ticket.priority,
    description: req.body.description?.trim() || ticket.description,
    status: req.body.status?.trim() || ticket.status,
    assignedTo: req.body.assignedTo || ticket.assignedTo,
  };

  const updatedTicket = await Ticket.findByIdAndUpdate(req.params.id, updates, { new: true });
  res.status(200).json(updatedTicket);
});

/**
 * @desc    Delete a ticket
 * @route   DELETE /api/tickets/:id
 * @access  Private
 */
export const deleteTicket = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    res.status(404);
    throw new Error('Ticket not found.');
  }

  if (ticket.user.toString() !== req.user.id && !req.user.isAdmin) {
    res.status(403);
    throw new Error('Not authorized to delete this ticket.');
  }

  await ticket.deleteOne();
  res.status(200).json({ message: 'Ticket deleted successfully.' });
});

/**
 * @desc    Admin: Get all tickets
 * @route   GET /api/tickets/all
 * @access  Private/Admin
 */
export const getAllTickets = asyncHandler(async (req, res) => {
  const tickets = await Ticket.find().populate('user', 'name email').sort({ createdAt: -1 });
  res.status(200).json(tickets);
});

/**
 * @desc    Admin: Assign a ticket
 * @route   PUT /api/tickets/:id/assign
 * @access  Private/Admin
 */
export const assignTicket = asyncHandler(async (req, res) => {
  const { assignedTo } = req.body;
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    res.status(404);
    throw new Error('Ticket not found.');
  }

  ticket.assignedTo = assignedTo;
  ticket.status = 'Assigned';

  const updatedTicket = await ticket.save();
  res.status(200).json(updatedTicket);
});

/**
 * @desc    Admin: Resolve a ticket
 * @route   PUT /api/tickets/:id/resolve
 * @access  Private/Admin
 */
export const resolveTicket = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    res.status(404);
    throw new Error('Ticket not found.');
  }

  ticket.status = 'Resolved';

  const updatedTicket = await ticket.save();
  res.status(200).json(updatedTicket);
});

/**
 * @desc    Get notes for a ticket
 * @route   GET /api/tickets/:id/notes
 * @access  Private
 */
export const getTicketNotes = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    res.status(404);
    throw new Error('Ticket not found.');
  }

  if (ticket.user.toString() !== req.user.id && !req.user.isAdmin) {
    res.status(403);
    throw new Error('Not authorized to view notes.');
  }

  const notes = await Note.find({ ticket: req.params.id }).sort({ createdAt: -1 });
  res.status(200).json(notes);
});

/**
 * @desc    Create a note for a ticket
 * @route   POST /api/tickets/:id/notes
 * @access  Private
 */
export const createTicketNote = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    res.status(404);
    throw new Error('Ticket not found.');
  }

  if (ticket.user.toString() !== req.user.id && !req.user.isAdmin) {
    res.status(403);
    throw new Error('Not authorized to add a note.');
  }

  const text = req.body.text?.trim();
  if (!text) {
    res.status(400);
    throw new Error('Note text is required.');
  }

  const note = await Note.create({
    ticket: req.params.id,
    user: req.user.id,
    text,
  });

  res.status(201).json(note);
});
