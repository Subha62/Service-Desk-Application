import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createTicket, reset } from "../features/tickets/ticketSlice";
import Spinner from "../components/Spinner";
import BackButton from "../components/BackButton";

function NewTicket() {
  const { user } = useSelector((state) => state.auth);
  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.tickets
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();


  const [name] = useState(user.name);
  const [email] = useState(user.email);

  
  const [product, setProduct] = useState("");
  const [category, setCategory] = useState("Hardware");
  const [priority, setPriority] = useState("Low");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess) {
      dispatch(reset());
      navigate("/tickets");
    }

    return () => {
      dispatch(reset());
    };
  }, [isError, isSuccess, message, navigate, dispatch]);

  const onSubmit = (e) => {
    e.preventDefault();

    
    const trimmedProduct = product.trim();
    const trimmedCategory = category.trim();
    const trimmedPriority = priority.trim();
    const trimmedDescription = description.trim();

    if (!trimmedProduct || !trimmedCategory || !trimmedPriority || !trimmedDescription) {
      toast.error("Please fill in all fields properly.");
      return;
    }

    dispatch(
      createTicket({
        product: trimmedProduct,
        category: trimmedCategory,
        priority: trimmedPriority,
        description: trimmedDescription,
      })
    );
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <BackButton url="/" />

      <section className="heading">
        <h1>Create New Ticket</h1>
        <p>Please fill out the form below</p>
      </section>

      <section className="form">
        <div className="form-group">
          <label htmlFor="name">Customer Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={name}
            disabled
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Customer Email</label>
          <input
            type="text"
            className="form-control"
            id="email"
            value={email}
            disabled
          />
        </div>

        <form onSubmit={onSubmit}>
          {/*  New Product Field */}
          <div className="form-group">
            <label htmlFor="product">Product</label>
            <input
              id="product"
              type="text"
              className="form-control"
              placeholder="Enter product name"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="form-control"
            >
              <option value="Hardware">Hardware</option>
              <option value="Software">Software</option>
              <option value="Network">Network</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="form-control"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              className="form-control"
              placeholder="Describe the issue..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <div className="form-group">
            <button type="submit" className="btn btn-block">
              Submit
            </button>
          </div>
        </form>
      </section>
    </>
  );
}

export default NewTicket;
