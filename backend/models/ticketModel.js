import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema(
  {
    // The user who created the ticket
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Ticket category (e.g., IT, HR, Facilities)
    category: {
      type: String,
      required: true,
      trim: true,
    },

    // The actual product or asset related to the ticket (e.g., Laptop, Printer)
    product: {
      type: String,
      required: true,
      trim: true,
    },

    // Priority level
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Low',
    },

    // Description of the issue
    description: {
      type: String,
      required: true,
      trim: true,
    },

    // Status of the ticket
    status: {
      type: String,
      enum: ['Open', 'Assigned', 'In Progress', 'Resolved', 'Closed'],
      default: 'Open',
    },

    // Admin or staff the ticket is assigned to
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

const Ticket = mongoose.model('Ticket', ticketSchema);

export default Ticket;
