import { Link } from 'react-router-dom';

function TicketItem({ ticket }) {
  return (
    <div className="ticket">
      <div>{new Date(ticket.createdAt).toLocaleDateString('en-US')}</div>
      <div>{ticket.category || 'N/A'}</div>
      <div>{ticket.priority || 'N/A'}</div>
      <div className={`status status-${ticket.status}`}>
        {ticket.status}
      </div>
      <Link
        to={`/ticket/${ticket._id}`}
        className="btn btn-reverse btn-sm"
      >
        View
      </Link>
    </div>
  );
}

export default TicketItem;
