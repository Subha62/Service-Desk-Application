import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getTicket, closeTicket } from "../features/tickets/ticketSlice";
import { getNotes, createNote } from "../features/notes/noteSlice";
import BackButton from "../components/BackButton";
import Spinner from "../components/Spinner";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import NoteItem from "../components/NoteItem";
import Modal from "react-modal";
import { FaPlus } from "react-icons/fa";

const customStyles = {
  content: {
    width: "600px",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    position: "relative",
  },
};

Modal.setAppElement("#root");

function Ticket() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [noteText, setNoteText] = useState("");

  const { ticket, isLoading, isError, message } = useSelector(
    (state) => state.tickets
  );
  const { notes, isLoading: notesIsLoading } = useSelector(
    (state) => state.notes
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { ticketId } = useParams();

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    dispatch(getTicket(ticketId));
    dispatch(getNotes(ticketId));
    // eslint-disable-next-line
  }, [isError, message, ticketId]);

  const onTicketClose = () => {
    dispatch(closeTicket(ticketId));
    toast.success("Ticket closed successfully");
    navigate("/tickets");
  };

  const onNoteSubmit = (e) => {
    e.preventDefault();
    if (!noteText.trim()) {
      toast.error("Note text is required");
      return;
    }
    dispatch(createNote({ noteText, ticketId }));
    closeModal();
    setNoteText("");
  };

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  if (isLoading) return <Spinner />;

  if (isError)
    return (
      <h3 style={{ color: "red" }}>Something went wrong: {message}</h3>
    );

  return (
    <div className="ticket-page">
      <header className="ticket-header">
        <BackButton url="/tickets" />
        <h2>
          Ticket Id: {ticket._id || "N/A"}
          <span className={`status status-${ticket.status}`}>
            {ticket.status || "N/A"}
          </span>
        </h2>
        <h3>
          Date Submitted:{" "}
          {ticket.createdAt
            ? new Date(ticket.createdAt).toLocaleDateString("en-US")
            : "N/A"}
        </h3>
        <h3>Category: {ticket.category || "N/A"}</h3>
        <h3>Priority: {ticket.priority || "N/A"}</h3>
        <hr />
        <div className="ticket-desc">
          <h3>Description of Issue</h3>
          <p>{ticket.description || "No description provided."}</p>
        </div>
      </header>

      {ticket.status !== "closed" && (
        <button onClick={openModal} className="btn">
          <FaPlus /> Add Note
        </button>
      )}

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Add Note"
      >
        <h2>Add Note</h2>
        <button className="btn-close" onClick={closeModal}>
          X
        </button>
        <form onSubmit={onNoteSubmit}>
          <div className="form-group">
            <textarea
              name="noteText"
              id="noteText"
              className="form-control"
              placeholder="Note Text"
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
            ></textarea>
          </div>
          <div className="form-group">
            <button className="btn" type="submit">
              Submit
            </button>
          </div>
        </form>
      </Modal>

      {notesIsLoading && <Spinner />}
      {notes.map((note) => (
        <NoteItem key={note._id} note={note} />
      ))}

      {ticket.status !== "closed" && (
        <button
          onClick={onTicketClose}
          className="btn btn-block btn-danger"
        >
          Close Ticket
        </button>
      )}
    </div>
  );
}

export default Ticket;
